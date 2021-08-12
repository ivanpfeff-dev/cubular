using CubularServer.Network.Messages;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CubularServer.Network
{
    public class ConnectionManager : IConnectionManager
    {
        private readonly List<INetState> _connections = new List<INetState>();

        public ConnectionManager()
        {
        }

        public void AddConnection(INetState netState)
        {
            lock(_connections)
            {
                _connections.Add(netState);
            }
        }

        public void RemoveConnection(INetState netState)
        {
            lock (_connections)
            {
                _connections.Remove(netState);
            }
        }

        private List<INetState> GetConnections()
        {
            lock (_connections)
            {
                return _connections.ToList();
            }
        }

        public async Task Broadcast(IServerMessage message, CancellationToken cancellationToken)
        {
            var connections = GetConnections();
            await BroadcastInternal(message, connections, cancellationToken);
        }

        public async Task BroadcastExclusive(IServerMessage message, INetState excluded, CancellationToken cancellationToken)
        {
            var connections = GetConnections();
            connections.Remove(excluded);
            await BroadcastInternal(message, connections, cancellationToken);
        }

        private async Task BroadcastInternal(IServerMessage message, List<INetState> recipients, CancellationToken cancellationToken)
        {
            foreach(var netState in recipients)
            {
                await netState.SendMessage(message, cancellationToken);
            }
        }
    }
}
