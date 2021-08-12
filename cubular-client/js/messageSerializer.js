function MessageSerializer() {
    this.serializeMessage = function(message) {
        var messageType = message.messageType;
        delete message.messageType;
        return JSON.stringify({
            messageType: messageType,
            messageJson: JSON.stringify(message),
        });
    };

    this.deserializeMessage = function(json) {
        var wrapper = JSON.parse(json);
        var message = JSON.parse(wrapper.messageJson);
        message.messageType = wrapper.messageType;
        console.log("Message received: ");
        console.log(wrapper.messageJson);
        return message;
    }
};

module.exports = MessageSerializer;