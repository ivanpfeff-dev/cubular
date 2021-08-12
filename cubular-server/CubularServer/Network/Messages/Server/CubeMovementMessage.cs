using CubularServer.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CubularServer.Network.Messages
{
    public class CubeMovementMessage : IServerMessage
    {
        public int ID { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
        public Direction Direction { get; set; }

        public CubeMovementMessage(ICube cube, Direction turning)
        {
            ID = cube.ID;
            X = cube.X;
            Y = cube.Y;
            Z = cube.Z;
            Direction = turning;
        }
    }
}
