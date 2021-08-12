using CubularServer.Network.Messages;
using log4net;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Text;

namespace CubularServer.Network
{
    public class MessageSerializer : IMessageSerializer
    {
        private static readonly ILog _log = LogManager.GetLogger(typeof(MessageSerializer));
        private readonly Dictionary<MessageType, Type> _messageTypeToConcreteTypeLookup;
        private readonly Dictionary<Type, MessageType> _concreteTypeToMessageTypeLookup;

        private readonly JsonSerializerSettings _serializerSettings = new JsonSerializerSettings()
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        public MessageSerializer()
        {
            _messageTypeToConcreteTypeLookup = new Dictionary<MessageType, Type>();
            _concreteTypeToMessageTypeLookup = new Dictionary<Type, MessageType>();
            RegisterMappings(MessageType.SpawnRequested, typeof(SpawnRequestMessage));
            RegisterMappings(MessageType.SpawnAccepted, typeof(SpawnAcceptedMessage));
            RegisterMappings(MessageType.MovementRequest, typeof(MovementRequestMessage));
            RegisterMappings(MessageType.MovementAccepted, typeof(MovementAcceptedMessage));
            RegisterMappings(MessageType.MovementRejected, typeof(MovementRejectedMessage));
            RegisterMappings(MessageType.MovementRejected, typeof(MovementRejectedMessage));
            RegisterMappings(MessageType.CubeInfo, typeof(CubeInfoMessage));
            RegisterMappings(MessageType.CubeMovement, typeof(CubeMovementMessage));
            RegisterMappings(MessageType.CubeDestroyed, typeof(CubeDestroyedMessage));
        }

        private void RegisterMappings(MessageType messageType, Type concreteType)
        {
            _messageTypeToConcreteTypeLookup[messageType] = concreteType;
            _concreteTypeToMessageTypeLookup[concreteType] = messageType;
        }

        private bool TryGetDeserializedWrapper(byte[] data, out MessageWrapper wrapper)
        {
            wrapper = null;
            var json = Encoding.UTF8.GetString(data);
            try
            {
                wrapper = JsonConvert.DeserializeObject<MessageWrapper>(json);
                return true;
            }
            catch
            {
                _log.Warn($"Failed to deserialize wrapper object with json: {json}");
                return false;
            }
        }
        
        private bool TryGetUnderlyingMessage(MessageWrapper wrapper, out IClientMessage message)
        {
            message = null;
            if (_messageTypeToConcreteTypeLookup.TryGetValue(wrapper.MessageType, out Type concreteType))
            {
                try
                {
                    message = (IClientMessage)JsonConvert.DeserializeObject(wrapper.MessageJson, concreteType);
                    return true;
                }
                catch
                {
                    _log.Warn($"Error during message deserialization for message type {wrapper.MessageType}");
                    _log.Warn($"Serialized message: {wrapper.MessageJson}");

                    return false;
                }
            }
            else
            {
                _log.Warn($"Deserialization failed on message type {wrapper.MessageType} which has no concrete type mapping");
                return false;
            }
        }

        public bool TryDeserialize(byte[] data, out IClientMessage message)
        {
            message = null;
            return TryGetDeserializedWrapper(data, out MessageWrapper wrapper) 
                    ? TryGetUnderlyingMessage(wrapper, out message) : false;
        }

        private bool TryGetUnderlyingJson(IServerMessage message, out string json)
        {
            json = string.Empty;

            try
            {
                json = JsonConvert.SerializeObject(message, _serializerSettings);
                return true;
            }
            catch
            {
                _log.Warn($"Error during message serialization for underlying message {message.GetType().Name}");
                return false;
            }
        }

        private bool TryGetSerializedWrapper(string underlyingJson, Type concreteType, out byte[] data)
        {
            data = null;
            if (_concreteTypeToMessageTypeLookup.TryGetValue(concreteType, out MessageType messageType))
            {
                try
                {
                    var wrapper = new MessageWrapper
                    {
                        MessageType = messageType,
                        MessageJson = underlyingJson
                    };
                    var json = JsonConvert.SerializeObject(wrapper, _serializerSettings);
                    data = Encoding.UTF8.GetBytes(json);
                    return true;
                }
                catch
                {
                    return false;
                }
            }
            else
            {
                _log.Warn($"Serialization failed on message type {concreteType.Name} which has no message type mapping");
                return false;
            }
        }

        public bool TrySerialize(IServerMessage message, out byte[] data)
        {
            data = null;
            return TryGetUnderlyingJson(message, out string underlyingJson)
                    ? TryGetSerializedWrapper(underlyingJson, message.GetType(), out data) : false;
        }
    }
}
