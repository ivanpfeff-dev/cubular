var Direction = require('./direction');
var KeyState = require('./keystate');

function InputManager(world, network) {
    var keyState = new KeyState();

    this.cycle = function() {
        var direction = keyState.getDirection();
        if (world.playerCube.turning != Direction.None || direction == Direction.None )
          return;
    
        if (world.canMove(world.playerCube, direction)) {
          world.playerCube.startTurn(direction);
          world.moveCube(world.playerCube, world.playerCube.getNextPosition());
          network.sendMovementRequest(direction);
        }
    };
};

module.exports = InputManager;