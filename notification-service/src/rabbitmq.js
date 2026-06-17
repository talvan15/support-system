const amqp = require('amqplib');

async function connectRabbit() {

    try {

        const connection = await amqp.connect(
            process.env.RABBITMQ_URL ||
            'amqp://guest:guest@localhost:5672'
        );

        const channel =
            await connection.createChannel();

        await channel.assertExchange(
            'support.exchange',
            'fanout',
            {
                durable: true
            }
        );

        return channel;

    } catch (error) {

        console.error(
            'Erro ao conectar RabbitMQ:',
            error
        );

    }

}

module.exports = connectRabbit;