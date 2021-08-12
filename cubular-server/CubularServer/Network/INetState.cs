using CubularServer.Game;
using CubularServer.Network.Messages;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CubularServer.Network
{
    public interface INetState : IDisposable
    {
        ICube Cube { get; set; }
        void AssignCube(ICube cube);
        Task DoHandshake(CancellationToken cancellationToken);
        Task BeginReceiving(CancellationToken cancellationToken);
        Task SendMessage(IServerMessage message, CancellationToken cancellationToken);
    }
}
