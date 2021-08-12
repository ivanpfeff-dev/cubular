function MessageType() {
};

MessageType.SpawnRequested = 0;
MessageType.SpawnAccepted = 1;
MessageType.MovementRequest = 2;
MessageType.MovementAccepted = 3;
MessageType.MovementRejected = 4;
MessageType.CubeInfo = 5;
MessageType.CubeMovement = 6;
MessageType.CubeDestroyed = 7;

module.exports = MessageType;