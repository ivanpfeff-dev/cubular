using CubularServer.Network.Messages;
using log4net;
using System.Collections.Generic;

namespace CubularServer.Game
{
    public class MessageQueue : IMessageQueue
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(MessageQueue));

        private readonly Queue<IClientMessage> _queue = new Queue<IClientMessage>();

        public void Enqueue(IClientMessage message)
        {
            lock(_queue)
            {
                _queue.Enqueue(message);
            }
        }

        public bool TryDequeue(out IClientMessage message)
        {
            lock(_queue)
            {
                if(_queue.Count > 0)
                {
                    return _queue.TryDequeue(out message);
                }
                else
                {
                    message = null;
                    return false;
                }
            }
        }
    }
}
