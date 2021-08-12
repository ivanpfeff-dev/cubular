var Direction = require('./direction');
var Point = require('./point');

function Cube() {
  this.position = new Point(0, 0, 0);
  this.id = '' + new Date().getTime(); //arbitrary for now, later will be dictated by server
	
  this.turning = Direction.None;
  this.turnStarted = 0;
  this.turnEnding = 0;
}

Cube.prototype.translate = function(x, y, z) {
  this.position = this.position.translate(x, y, z);
};

Cube.prototype.getNextPosition = function(direction) {
  direction = direction || this.turning;
  if (direction == Direction.None) {
    return this.position;
  }
  if (direction == Direction.Up) {
    return this.position.translate(1, 0, 0);
  }
  if (direction == Direction.Down) {
    return this.position.translate(-1, 0, 0);
  }
  if (direction == Direction.Left) {
    return this.position.translate(0, 1, 0);
  }
  if (direction == Direction.Right) {
    return this.position.translate(0, -1, 0);
  }
};

Cube.prototype.getRotationTime = function() {
  return 105;
};

Cube.prototype.startTurn = function(direction) {
  this.turning = direction;
  this.turnStarted = new Date().getTime();
  this.turnEnding = this.turnStarted + this.getRotationTime();
};

Cube.prototype.getTurnProgress = function() {
  if (this.turning == Direction.None) {
    return 0;
  }
  var now = new Date().getTime();
  var rotationTime = this.turnEnding - this.turnStarted;
  var currentTime = now - this.turnStarted;
  var turnProgress = currentTime /rotationTime;
  if (turnProgress > 1) 
   turnProgress = 1;
  return turnProgress;
};

Cube.prototype.getAngle = function() {
  if (this.turning != Direction.None) {
    var turnProgress = this.getTurnProgress();
    return turnProgress * Math.PI / 2;
  } else {
    return 0;
  }
};

Cube.prototype.setTurn = function(direction, starting, ending) {
  this.turning = direction;
  this.turnStarted = starting;
  this.turnEnding = ending;
};

Cube.prototype.resetTurn = function() {
  this.turnStarted = 0;
  this.turnEnding = 0;
  this.turning = Direction.None;
};

Cube.prototype.shouldMove = function() {
  var now = new Date().getTime();
  if (this.turning != Direction.None && now > this.turnEnding) {
    return true;
  }

  return false;
};

module.exports = Cube;