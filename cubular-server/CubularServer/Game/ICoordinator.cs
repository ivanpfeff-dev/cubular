using CubularServer.Network;
using System.Threading;
using System.Threading.Tasks;

namespace CubularServer.Game
{
    public interface ICoordinator
    {
        Task Cycle(CancellationToken cancellationToken);
    }
}