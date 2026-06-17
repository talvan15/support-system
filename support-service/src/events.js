const { getChannel } = require('./config');

async function publishMessage(message) {
    const channel = getChannel();

    channel.publish(
        'support.exchange',
        '',
        Buffer.from(JSON.stringify(message))
    );

    console.log('Evento publicado:', message);
}


module.exports = {
    publishMessage
};