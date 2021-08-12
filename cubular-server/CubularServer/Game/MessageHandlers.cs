using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using CubularServer.Network.Messages;
using log4net;
using System.Linq;
using System.Reflection;
using System.Threading;
using CubularServer.Network;

namespace CubularServer.Game
{
    public class MessageHandlers : IMessageHandler
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(MessageHandlers));

        private readonly IConnectionManager _connectionManager;
        private readonly IWorld _world;

        private readonly Dictionary<Type, MethodInfo> _handlerLookup;

        public MessageHandlers(IConnectionManager connectionManager, IWorld world)
        {
            _connectionManager = connectionManager;
            _world = world;

            var messageInterface = typeof(IClientMessage);
            var handlerMethods = typeof(MessageHandlers).GetMethods(BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.InvokeMethod);
            _handlerLookup = handlerMethods
                .Where(x => 
                {
                    var parameters = x.GetParameters();
                    return parameters.Length == 2 && messageInterface.IsAssignableFrom(parameters[0].ParameterType);
                })
                .ToDictionary(x =>
                {
                    var parameters = x.GetParameters();
                    return parameters[0].ParameterType;
                });
        }

        public async Task HandleMessage(IClientMessage message, CancellationToken cancellationToken)
        {
            if (_handlerLookup.TryGetValue(message.GetType(), out MethodInfo handler))
            {
                await (Task) handler.Invoke(this, new object[] { message, cancellationToken });
            }
            else
            {
                _log.Warn($"Received a messagee with message type {message.GetType().Name} but found no handler");
            }
        }

        private async Task Handle_SpawnRequest(SpawnRequestMessage message, CancellationToken cancellationToken)
        {
            var netState = message.NetState;
            var playerCube = _world.SpawnNewCube(netState);

            var playerCubeInfo = new CubeInfoMessage(playerCube);
            await _connectionManager.BroadcastExclusive(playerCubeInfo, netState, cancellationToken);

            var cubes = _world.GetCubes();
            cubes.ForEach(async cube =>
            {
                var cubeInfo = new CubeInfoMessage(cube);
                await netState.SendMessage(cubeInfo, cancellationToken);
            });

            netState.AssignCube(playerCube);
            var spawnAcceptedMessage = new SpawnAcceptedMessage(playerCube);
            await netState.SendMessage(spawnAcceptedMessage, cancellationToken);
        }

        private async Task Handle_MovementRequest(MovementRequestMessage message, CancellationToken cancellationToken)
        {
            var netState = message.NetState;
            var cube = netState.Cube;
            var moveAllowed = _world.Move(cube, message.Direction);
            if(moveAllowed)
            {
                await netState.SendMessage(new MovementAcceptedMessage(), cancellationToken);
                var movementMessage = new CubeMovementMessage(cube, message.Direction);
                await _connectionManager.BroadcastExclusive(movementMessage, netState, cancellationToken);
            }
            else
            {
                await netState.SendMessage(new MovementRejectedMessage(cube), cancellationToken);
            }
        }

        private async Task Handle_ClientDisconnect(ClientDisconnectedMessage message, CancellationToken cancellationToken)
        {
            var cube = message.Cube;
            _world.DestroyCube(cube);
            await _connectionManager.Broadcast(new CubeDestroyedMessage(cube.ID), cancellationToken);
        }
    }
}
