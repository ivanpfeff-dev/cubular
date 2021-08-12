using CubularServer.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CubularServer.Network.Messages
{
    public class MovementRequestMessage : MessageBase
    {
        public Direction Direction { get; set; }
    }
}
