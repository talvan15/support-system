const { publishMessage } =
require('./events');

const sessions = [];

const messages = [];

function createSession(customer) {

    const session = {
        id: sessions.length + 1,
        customer,
        createdAt: new Date()
    };

    sessions.push(session);

    return session;
}

async function sendMessage(data) {

    const message = {
        id: messages.length + 1,
        sessionId: data.sessionId,
        customer: data.customer,
        message: data.message,
        createdAt: new Date()
    };

    messages.push(message);

    await publishMessage(
        message
    );

    return message;
}

function getHistory(sessionId) {

    return messages.filter(
        msg =>
            msg.sessionId ==
            sessionId
    );
}

module.exports = {
    createSession,
    sendMessage,
    getHistory
};