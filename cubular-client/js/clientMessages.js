var MessageType = require('./messageType');

module.exports = {
    SpawnRequestMessage: function () {
        this.messageType = MessageType.SpawnRequested;
    },

    MovementRequestMessage: function (direction) {
        this.messageType = MessageType.MovementRequest;
        this.direction = direction;
    }
};