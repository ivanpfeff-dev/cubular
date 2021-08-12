namespace CubularServer.Network.Messages
{
    public class CubeDestroyedMessage : IServerMessage
    {
        public int ID { get; set; }

        public CubeDestroyedMessage(int id)
        {
            ID = id;
        }
    }
}
