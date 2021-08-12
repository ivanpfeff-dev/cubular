using CubularServer.Network.Messages;
using System.Threading;
using System.Threading.Tasks;

namespace CubularServer.Network
{
    public interface IConnectionManager
    {
        void AddConnection(INetState netState);
        void RemoveConnection(INetState netState);
        Task Broadcast(IServerMessage message, CancellationToken cancellationToken);
        Task BroadcastExclusive(IServerMessage message, INetState exclude, CancellationToken cancellationToken);
    }
}