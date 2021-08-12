using CubularServer.Network.Messages;
using log4net;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CubularServer.Game
{
    public class Coordinator : ICoordinator
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(Coordinator));

        private readonly IWorld _world;
        private readonly IMessageQueue _messageQueue;
        private readonly IMessageHandler _messageHandlers;

        public Coordinator(IWorld world, IMessageQueue messageQueue, IMessageHandler messageHandlers)
        {
            _world = world;
            _messageQueue = messageQueue;
            _messageHandlers = messageHandlers;
        }
        
        public async Task Cycle(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(10);
                    await ProcessMessages(cancellationToken);
                    UpdateWorld();
                }
                catch(Exception e)
                {
                    _log.Error($"Error encountered during cycle: {e}");
                }
            }
        }

        private void UpdateWorld()
        {
            _world.Cycle();
        }

        private async Task ProcessMessages(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested && _messageQueue.TryDequeue(out IClientMessage message))
            {
                await _messageHandlers.HandleMessage(message, cancellationToken);
            }
        }
    }
}
