using CubularServer.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CubularServer.Network.Messages
{
    public class ClientDisconnectedMessage : MessageBase
    {
        public ICube Cube { get; set; }
    }
}
