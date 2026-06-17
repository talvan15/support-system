const services = require('./services');

async function createSession(req, res) {
    const session = services.createSession(req.body.customer);

    res.status(201).json(session);
}

async function sendMessage(req, res) {
    const message = await services.sendMessage(req.body);

    res.status(201).json(message);
}

function getHistory(req, res) {
    const history = services.getHistory(
        req.params.sessionId
    );

    res.json(history);
}


module.exports = {
    createSession,
    sendMessage,
    getHistory
};