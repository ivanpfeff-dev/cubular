using CubularServer.Network;
using System;

namespace CubularServer.Game
{
    public interface ICube : IID, IPoint3D
    {
        INetState NetState { get; set; }
        DateTime NextMovement { get; set; }
        bool FailedMovement { get; set; }
    }
}