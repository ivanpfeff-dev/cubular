var Direction = require('./direction');

function KeyState() {
  var isUp = false;
  var isDown	= false;
  var isLeft = false;
  var isRight = false;
	
  this.processUpEvent = function(keyEvent) {
    var key = keyEvent.key;
    if (key == 'ArrowUp')
     isUp = false;
    else if (key == 'ArrowDown') 
     isDown = false;
    else if (key == 'ArrowLeft')
     isLeft = false;
    else if (key == 'ArrowRight') 
     isRight = false;
  };
	
  this.processDownEvent = function(keyEvent) {
    var key = keyEvent.key;
    if (key == 'ArrowUp')
     isUp = true;
    else if (key == 'ArrowDown') 
     isDown = true;
    else if (key == 'ArrowLeft')
     isLeft = true;
    else if (key == 'ArrowRight') 
     isRight = true;
  };
	
  this.getDirection = function() {
    if (isUp)
     return Direction.Up;
    if (isDown) 
     return Direction.Down;
    if (isLeft)
     return Direction.Left;
    if (isRight) 
     return Direction.Right;
   
    return Direction.None;
  };

  window.onkeyup = this.processUpEvent;
  window.onkeydown = this.processDownEvent;
}

module.exports = KeyState;