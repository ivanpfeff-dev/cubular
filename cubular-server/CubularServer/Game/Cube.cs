using CubularServer.Network;
using log4net;
using System;

namespace CubularServer.Game
{
    public class Cube : ICube
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(Cube));

        public INetState NetState { get; set; }

        public int ID { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
        public DateTime NextMovement { get; set; } = DateTime.MinValue;
        public bool FailedMovement { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        public Cube(INetState netState, IIDProvider idProvider)
        {
            ID = idProvider.GetUniqueId();
            NetState = netState;
        }
    }
}
