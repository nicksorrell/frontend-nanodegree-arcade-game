/***********
* ENEMY - An enemy the player must avoid. It will move across the screen and send the player back to the beginning upon contact.
*         Data updating and rendering methods are called by the game loop.
***********/

//Set class values: the sprite image, delay in reset after crossing the screen, row number, speed, and position
//Custom row and delay can be given; something between 1 and 10 will work fine for delay
var Enemy = function(row, delay) {
    this.sprite = 'images/enemy-bug.png';
    this.delay = delay || 0;
    //The rowsY object is used to easily assign a row / yPos to an enemy upon creation
    var rowsY = {
      3: 220,
      4: 140,
      5: 50
    };
    //The enemy will choose a random speed and move left to right along its assigned row
    this.row = row || 3;
    this.speed = Math.floor(Math.random() * 250) + 100;
    this.x = 0 - (this.delay * 100);
    this.y = rowsY[row];
};

//Update the logical position of the enemy, and reset it if it's off the edge of the screen. Reset the player is they are hit too!
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    if(this.x > ctx.canvas.clientWidth) {
      this.reset();
    }

    if(this.x + 50 >= player.x && this.x + 50 <= player.x + 100 && this.row == player.row) {
      player.reset();
    }
};

//Draw the enemy sprite on screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Reset the enemy position and choose a new speed. The delay position serves as an added time delay
Enemy.prototype.reset = function() {
  this.x = -100 - (this.delay * 100);
  this.speed = Math.floor(Math.random() * (250-100)) + 100;
};


/***********
* GOLD ENEMY - A special gold version of the enemy which moves in the opposite direction from all the other enemies, and chooses random rows
***********/

//Set class values: the sprite image, delay in reset after crossing the screen, row number, speed, and position
//Custom delay can be given; something between 1 and 10 will work fine
var GoldEnemy = function(delay){
  this.sprite = 'images/enemy-bug-gold.png';
  this.delay = delay || 5;
  //The rowsY object is used to easily assign a row / yPos to an enemy upon creation
  this.rowsY = {
    3: 220,
    4: 140,
    5: 50
  };
  //The enemy will choose a random speed AND row, and move right to left along the chosen row
  var rand = Math.floor(Math.random() * (6-3)) + 3;
  this.row = rand;
  this.speed = Math.floor(Math.random() * 500) + 400;
  this.x = 0 + (this.delay * 100);
  this.y = this.rowsY[rand];
};

//Use the ENEMY prototype to delegate common methods not custom to gold enemies, such as render
GoldEnemy.prototype = Object.create(Enemy.prototype);

//Update the logical position of the enemy, and reset it if it's off the edge of the screen. Reset the player is they are hit too!
GoldEnemy.prototype.update = function(dt) {
    this.x -= this.speed * dt;

    if(this.x < -(this.delay * 100)) {
      this.reset();
    }

    if(this.x <= player.x + 50 && this.x > player.x && this.row == player.row) {
      player.reset();
    }
};

//Reset the enemy position and choose a new speed and row. The delay position serves as an added time delay.
GoldEnemy.prototype.reset = function(){
  var rand = Math.floor(Math.random() * (6-3)) + 3;
  this.row = rand;
  this.x = 0 + (this.delay * 100);
  this.y = this.rowsY[rand];
  this.speed = Math.floor(Math.random() * 500) + 400;
};


/***********
* PLAYER - The player character! Controlled by keyboard arrow keys, and jumps from one tile to another
***********/

//Set class values: the sprite image, starting position, and distance to jump
var Player = function() {
  this.sprite = 'images/char-pink-girl.png';
  //We keep track of the row for easily detecing when the player reaches the top
  this.row = 1;
  this.startX = 200;
  this.startY = 400;
  this.x = this.startX;
  this.y = this.startY;
  //No need to change these unless you want minute visual adjustments
  this.moveSpeedX = 100;
  this.moveSpeedY = 90;
};

//Update the logical position of the played, and reset them if they reach the top
//Make sure the player cant go off the screen too!
Player.prototype.update = function(dt) {
  if(this.x < 0) {
    this.x = 0;
  }

  if(this.x > 400 ) {
    this.x = 400;
  }

  if(this.row > 5) {
    this.reset();
    //When the player reaches the top, add to the score
    theScore.add(50);
  }

  if(this.row < 1 ) {
    this.y = 400;
    this.row = 1;
  }
};

//Draw the player on screen
Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Check for keyboard input, and accept arrow keys for moving the player around
Player.prototype.handleInput = function(key){
  if(key == 'left') {
    this.x -= this.moveSpeedX;
  }

  if(key == 'right') {
    this.x += this.moveSpeedX;
  }

  if(key == 'up') {
    this.y -= this.moveSpeedY;
    this.row++;
  }

  if(key == 'down') {
    this.y += this.moveSpeedY;
    this.row--;
  }
};

//Rese the player to their starting position on screen
Player.prototype.reset = function(){
  this.x = this.startX;
  this.y = this.startY;
  this.row = 1;
};


/***********
* GEM - A gem that randomly appears at the top and grants extra points if the player reaches it
***********/

//Here we're trying a factory pattern instead of a constructor, just for fun, and to avoid coupling issues and provide potential for future flexibility.
var gem = {};

//Set the intial image, column, and list of colors
gem.prototype = {
  sprite: 'images/Gem Blue.png',
  column: 0,
  //We're using an array for easy numerical access to the gem color images
  colors : [
    'images/Gem Blue.png',
    'images/Gem Green.png',
    'images/Gem Orange.png'
  ],

  //If the player gets the gem, move it elsewhere and change its color
  update: function(){
    if(player.x >= this.column*100 && player.x < this.column*100+15 && player.row > 5) {
      this.column = Math.floor(Math.random() * (5));
      this.sprite = this.colors[Math.floor(Math.random() * (3))];
      theScore.add(200);
    }
  },

  //Draw the gem on the screen
  render: function(){
    ctx.drawImage(Resources.get(this.sprite), this.column*100 + 15, 25, 70, 100);
  }
};

//This is our factory function for producing gems. We specify the starting color and column here
gem.create = function(color, column){
  var obj = Object.create(gem.prototype);
  obj.sprite = obj.colors[color] || 'images/Gem Blue.png';
  obj.column = column || 0;
  return obj;
};


/***********
* SCORE - The player's score, shown at the top of the screen. Other entities can add to it.
***********/

//Set the initial score so 0
var Score = function(){
  this.points = 0;

  //Add the specified number of points to the screen
  this.add = function(points){
    this.points += points;
  };

  //Draw the score on the screen
  this.render = function(points){
    ctx.clearRect(0,0,100,50);
    ctx.fillText("Score: " + this.points, 0, 30);
  };
};


//Create all our entities, which include: Score, Player, Gem, and Enemies
//we store all our enemies in an array for easy access to their methods via teh game loop
var allEnemies = [];
allEnemies.push(new Enemy(3), new Enemy(4), new Enemy(5), new Enemy(4, 3), new Enemy(5, 1), new GoldEnemy(8));
var player = new Player();
var theGem = gem.create(1, 3);
var theScore = new Score();

// This listens for key presses and sends the keys to Player.handleInput method
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
