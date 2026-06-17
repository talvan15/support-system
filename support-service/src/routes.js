const express = require('express');

const controller =
    require('./controller');

const routes =
    express.Router();

routes.post(
    '/sessions',
    controller.createSession
);

routes.post(
    '/messages',
    controller.sendMessage
);

routes.get(
    '/history/:sessionId',
    controller.getHistory
);

module.exports = routes;