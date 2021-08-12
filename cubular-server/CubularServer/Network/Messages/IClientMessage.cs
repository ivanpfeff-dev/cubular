using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CubularServer.Network.Messages
{
    public interface IClientMessage
    {
        INetState NetState { get; set; }
    }
}
