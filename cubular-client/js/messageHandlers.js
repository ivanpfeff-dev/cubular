var Direction = require('./direction');
var Point = require('./point');
var Cube = require('./cube');
var MessageType = require('./messageType')


function MessageHandlers(world) {

    var handle_SpawnAccepted = function(message) {
        world.playerCube =  world.getCube(message.id);
    };

    var handle_CubeInfo = function(message) {
        var cube = new Cube();
        cube.id = message.id;
        cube.position = new Point(message.x, message.y, message.z);
        world.addCube(cube);
    };

    var handle_CubeMovement = function(message) {
        var cube = world.getCube(message.id);
        if(cube) {
            var position = new Point(message.x, message.y, message.z);
            world.moveCube(cube, position);
            cube.resetTurn();
            if(message.direction != Direction.None){
                cube.startTurn(message.direction);
            }
        }
    };

    var handle_CubeDestroyed = function(message) {
        var cube = world.getCube(message.id);
        if(cube) {
            world.removeCube(cube);
        }
    };

    var handle_MovementAccepted = function(message) {
    };

    var handle_MovementRejected = function(message) {
        var position = new Point(message.x, message.y, message.z);
        world.moveCube(world.playerCube, position);
        world.playerCube.resetTurn(message.direction, started, ending);
    };

    var handlerMappings = {};
    handlerMappings[MessageType.SpawnAccepted] = handle_SpawnAccepted;
    handlerMappings[MessageType.MovementAccepted] = handle_MovementAccepted;
    handlerMappings[MessageType.MovementRejected] = handle_MovementRejected;
    handlerMappings[MessageType.CubeInfo] = handle_CubeInfo;
    handlerMappings[MessageType.CubeMovement] = handle_CubeMovement;
    handlerMappings[MessageType.CubeDestroyed] = handle_CubeDestroyed;
    
    this.handleMessage = function(message) {
        var handler = handlerMappings[message.messageType];
        if(handler) {
            handler(message);
        }
    };
};

module.exports = MessageHandlers;