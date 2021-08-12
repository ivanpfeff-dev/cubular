namespace CubularServer.Network.Messages
{
    public class MessageBase : IClientMessage
    {
        public INetState NetState { get; set; }
    }
}
