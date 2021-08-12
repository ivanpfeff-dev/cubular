using CubularServer.Network.Messages;

namespace CubularServer.Game
{
    public interface IMessageQueue
    {
        void Enqueue(IClientMessage message);
        bool TryDequeue(out IClientMessage message);
    }
}