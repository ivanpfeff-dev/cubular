using CubularServer.Network.Messages;
using System.Threading;
using System.Threading.Tasks;

namespace CubularServer.Game
{
    public interface IMessageHandler
    {
        Task HandleMessage(IClientMessage message, CancellationToken cancellationToken);
    }
}