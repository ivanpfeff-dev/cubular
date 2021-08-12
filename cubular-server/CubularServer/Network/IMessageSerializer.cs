using CubularServer.Network.Messages;

namespace CubularServer.Network
{
    public interface IMessageSerializer
    {
        bool TryDeserialize(byte[] data, out IClientMessage message);
        bool TrySerialize(IServerMessage message, out byte[] data);
    }
}