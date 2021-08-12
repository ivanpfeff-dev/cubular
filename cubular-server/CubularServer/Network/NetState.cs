using System.Net.WebSockets;
using log4net;

using CubularServer.Game;
using System.Threading;
using CubularServer.Network.Messages;
using System.Threading.Tasks;
using System;

namespace CubularServer.Network
{
    public class NetState : INetState
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(NetState));

        private readonly IConnectionManager _connectionManager;
        private readonly IMessageSerializer _messageSerializer;
        private readonly IMessageQueue _messageQueue;
        private readonly WebSocket _socket;
        private readonly byte[] _buffer = new byte[0x1000];

        public ICube Cube { get; set; }

        public NetState(WebSocket socket, IConnectionManager connectionManager, IMessageSerializer messageParser, IMessageQueue messageQueue)
        {
            _connectionManager = connectionManager;
            _messageSerializer = messageParser;
            _messageQueue = messageQueue;

            _connectionManager.AddConnection(this);
            _socket = socket;
            _log.Info($"Connection received: {_socket.ToString()}");
        }

        public void AssignCube(ICube cube)
        {
            Cube = cube;
        }

        private async Task<IClientMessage> GetNextMessage(CancellationToken cancellationToken)
        {
            while (true)
            {
                var result = await _socket.ReceiveAsync(_buffer, cancellationToken);
                var deserializeBuffer = new byte[result.Count];
                Buffer.BlockCopy(_buffer, 0, deserializeBuffer, 0, result.Count);
                if (_messageSerializer.TryDeserialize(deserializeBuffer, out IClientMessage message))
                {
                    message.NetState = this;
                    return message;
                }
            }
        }

        public async Task DoHandshake(CancellationToken cancellationToken)
        {
            var spawnRequestMessage = await GetNextMessage(cancellationToken) as SpawnRequestMessage;
            if(spawnRequestMessage == null)
            {
                await CloseGracefully(cancellationToken);
            }
            _messageQueue.Enqueue(spawnRequestMessage);
        }

        public async Task BeginReceiving(CancellationToken cancellationToken)
        {
            var error = false;
            while(!cancellationToken.IsCancellationRequested && !error)
            {
                try
                {
                    var nextMessage = await GetNextMessage(cancellationToken);
                    _messageQueue.Enqueue(nextMessage);
                }
                catch
                {
                    error = true;
                    _log.Warn("A NetState was terminated when receiving");
                }
            }
        }

        public async Task SendMessage(IServerMessage message, CancellationToken cancellationToken)
        {
            if (_messageSerializer.TrySerialize(message, out byte[] data))
            {
                await _socket.SendAsync(data, WebSocketMessageType.Text, true, cancellationToken);
            }
        }

        private async Task CloseGracefully(CancellationToken cancellationToken)
        {
            await _socket.CloseAsync(WebSocketCloseStatus.InvalidMessageType, 
                "There was an error during client to server handshake", 
                cancellationToken);
        }

        public override string ToString()
        {
            return _socket.ToString();
        }

        public void Dispose()
        {
            _connectionManager.RemoveConnection(this);
            if(Cube != null)
            {
                var clientDisconnectedMessage = new ClientDisconnectedMessage();
                clientDisconnectedMessage.NetState = this;
                clientDisconnectedMessage.Cube = Cube;
                _messageQueue.Enqueue(clientDisconnectedMessage);
            }
        }
    }
}
