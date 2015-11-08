// Enemies our player must avoid
var Enemy = function(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    var rowsY = {
      3: 220,
      4: 140,
      5: 50
    };
    this.row = row || 3;
    this.speed = Math.floor(Math.random() * 250) + 100;
    this.width = 171;
    this.x = 0;
    this.y = rowsY[row];
    this.gridX = 0;
    this.gridY = 0;
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
  this.x = -100;
  this.speed = Math.floor(Math.random() * 250) + 100;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-boy.png';
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
allEnemies.push(new Enemy(3), new Enemy(4), new Enemy(5));
var player = new Player();


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
