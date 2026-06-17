const amqp = require('amqplib');

let channel;

async function connectRabbit() {
    const connection = await amqp.connect(
        process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672'
    );

    channel = await connection.createChannel();

    await channel.assertExchange(
        'support.exchange',
        'fanout',
        true
    );

    return channel;
}

function getChannel() {
    return channel;
}


module.exports = {
    connectRabbit,
    getChannel
};