using CubularServer.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CubularServer.Network.Messages
{
    public class MovementRejectedMessage : IServerMessage
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
        public Direction Direction { get; set; }
        public double TurnStarted { get; set; }
        public double TurnEnding { get; set; }

        public MovementRejectedMessage(ICube cube)
        {
            X = cube.X;
            Y = cube.Y;
            Z = cube.Z;
        }
    }
}
