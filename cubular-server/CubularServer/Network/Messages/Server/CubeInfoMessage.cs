using CubularServer.Game;

namespace CubularServer.Network.Messages
{
    public class CubeInfoMessage : IServerMessage
    {
        public int ID { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }

        public CubeInfoMessage(ICube cube)
        {
            ID = cube.ID;
            X = cube.X;
            Y = cube.Y;
            Z = cube.Z;
        }
    }
}
