namespace CubularServer.Network.Messages
{
    public enum MessageType
    {
        SpawnRequested,
        SpawnAccepted,
        MovementRequest,
        MovementAccepted,
        MovementRejected,
        CubeInfo,
        CubeMovement,
        CubeDestroyed,
    }
}
