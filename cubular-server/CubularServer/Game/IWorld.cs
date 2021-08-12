using CubularServer.Network;
using CubularServer.Network.Messages;
using System.Collections.Generic;

namespace CubularServer.Game
{
    public interface IWorld
    {
        ICube SpawnNewCube(INetState netState);
        List<ICube> GetCubes();
        bool Move(ICube cube, Direction direction);
        void DestroyCube(ICube cube);
        void Cycle();
    }
}