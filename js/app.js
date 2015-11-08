// Enemies our player must avoid
var Enemy = function(row, delay) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.delay = delay || 0;
    var rowsY = {
      3: 220,
      4: 140,
      5: 50
    };
    this.row = row || 3;
    this.speed = Math.floor(Math.random() * 250) + 100;
    this.x = 0 - (this.delay * 100);
    this.y = rowsY[row];
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if(this.x > ctx.canvas.clientWidth) this.reset();
    if(this.x + 50 >= player.x && this.x + 50 <= player.x + 100 && this.row == player.row) player.reset();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {
  this.x = -100 - (this.delay * 100);
  this.speed = Math.floor(Math.random() * (250-100)) + 100;
};

var GoldEnemy = function(delay){
  this.sprite = 'images/enemy-bug-gold.png';
  this.delay = delay || 5;
  this.rowsY = {
    3: 220,
    4: 140,
    5: 50
  };
  this.speed = Math.floor(Math.random() * 500) + 400;
  this.x = 0 + (this.delay * 100);
  var rand = Math.floor(Math.random() * (6-3)) + 3;
  this.row = rand;
  this.y = this.rowsY[rand];
};

GoldEnemy.prototype = Object.create(Enemy.prototype);

GoldEnemy.prototype.update = function(dt) {
    this.x -= this.speed * dt;
    if(this.x < -(this.delay * 100)) this.reset();
    if(this.x <= player.x + 50 && this.x > player.x && this.row == player.row) player.reset();
};

GoldEnemy.prototype.reset = function(){
  this.x = 0 + (this.delay * 100);
  var rand = Math.floor(Math.random() * (6-3)) + 3;
  this.row = rand;
  this.y = this.rowsY[rand];
  this.speed = Math.floor(Math.random() * 500) + 400;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-pink-girl.png';
  this.row = 1;
  this.startX = 200;
  this.startY = 400;
  this.x = this.startX;
  this.y = this.startY;
  this.moveSpeedX = 100;
  this.moveSpeedY = 90;
};

Player.prototype.update = function(dt) {
  if(this.x < 0) this.x = 0;
  if(this.row > 5) {
    this.reset();
    theScore.add(50);
  }
  if(this.x > 400 ) this.x = 400;
  if(this.row < 1 ) {
    this.y = 400;
    this.row = 1;
  }
};

Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key){
  if(key == 'left') this.x -= this.moveSpeedX;
  if(key == 'right') this.x += this.moveSpeedX;
  if(key == 'up') {
    this.y -= this.moveSpeedY;
    this.row++;
  }
  if(key == 'down') {
    this.y += this.moveSpeedY;
    this.row--;
  }
};

Player.prototype.reset = function(){
  this.x = this.startX;
  this.y = this.startY;
  this.row = 1;
};

var gem = {};

gem.prototype = {
  sprite: 'images/Gem Blue.png',
  column: 0,
  colors : [
    'images/Gem Blue.png',
    'images/Gem Green.png',
    'images/Gem Orange.png'
  ],
  update: function(){
    if(player.x >= this.column*100 && player.x < this.column*100+15 && player.row > 5) {
      this.column = Math.floor(Math.random() * (5));
      this.sprite = this.colors[Math.floor(Math.random() * (3))];
      theScore.add(200);
    }
  },
  render: function(){
    ctx.drawImage(Resources.get(this.sprite), this.column*100 + 15, 25, 70, 100);
  }
};

gem.create = function(color, column){
  var obj = Object.create(gem.prototype);
  obj.sprite = obj.colors[color] || 'images/Gem Blue.png';
  obj.column = column || 0;
  return obj;
};

var score = {
  points: 0,
  add: function(points){
    this.points += points;
  },
  render: function(points){
    ctx.clearRect(0,0,100,50);
    ctx.fillText("Score: " + this.points, 0, 30);
  }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies.push(new Enemy(3), new Enemy(4), new Enemy(5), new Enemy(4, 3), new Enemy(5, 1), new GoldEnemy(8));
var player = new Player();
var theGem = gem.create(1, 3);
var theScore = Object.create(score);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
