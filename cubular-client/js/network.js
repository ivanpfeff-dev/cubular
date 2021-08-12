var MessageSerializer = require('./messageSerializer');
var MessageHandlers = require('./messageHandlers');
var ClientMessages = require('./clientMessages');

function Network(world) {
    var socket;
    var callback;
    var messageQueue = [];
    var messageSerializer = new MessageSerializer();
    var messageHandlers = new MessageHandlers(world);

    var sendMessage = function(message) {
        var serializedMessage = messageSerializer.serializeMessage(message);
        socket.send(serializedMessage);
    }

    var socketClose = function(event) {
    };

    var socketError = function(event) {
    };

    var messageReceived = function(event) {
        var message = messageSerializer.deserializeMessage(event.data);
        messageQueue.push(message);
    };

    var connectionAccepted = function(event) {
        var spawnRequest = new ClientMessages.SpawnRequestMessage();
        sendMessage(spawnRequest);
    };

    this.sendMovementRequest = function(direction) {
        var movementRequest = new ClientMessages.MovementRequestMessage(direction);
        sendMessage(movementRequest);
    };

    this.beginConnect = function() {
        var host = "ws://localhost:64626/";
        socket = new WebSocket(host);
        socket.onopen = connectionAccepted;
        socket.onmessage = messageReceived;
        socket.onerror = socketError;
        socket.onclose = socketClose;
    };

    this.cycle = function() {
        while(messageQueue.length > 0){
            var message = messageQueue.shift();
            messageHandlers.handleMessage(message);
        }
    };
};

module.exports = Network;