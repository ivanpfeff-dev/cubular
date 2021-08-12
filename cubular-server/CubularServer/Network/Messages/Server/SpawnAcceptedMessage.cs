using CubularServer.Game;

namespace CubularServer.Network.Messages
{
    public class SpawnAcceptedMessage : IServerMessage
    {
        public int ID { get; set; }

        public SpawnAcceptedMessage(ICube cube)
        {
            ID = cube.ID;
        }
    }
}
