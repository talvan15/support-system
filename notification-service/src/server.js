const express = require('express');
const cors = require('cors');

const connectRabbit =
require('./rabbitmq');

const {
    addNotification,
    getNotifications
} = require('./notifications');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {

    res.json({
        service: 'notification-service',
        status: 'online'
    });

});

app.get('/notifications',
    (req, res) => {

        res.json(
            getNotifications()
        );

    }
);

async function consumeMessages() {

    const channel =
        await connectRabbit();

    const queue =
        await channel.assertQueue(
            '',
            {
                exclusive: true
            }
        );

    await channel.bindQueue(
        queue.queue,
        'support.exchange',
        ''
    );

    console.log(
        'Aguardando notificações...'
    );

    channel.consume(
        queue.queue,

        msg => {

            if (msg) {

                const data =
                    JSON.parse(
                        msg.content.toString()
                    );

                console.log(
                    'Nova notificação:',
                    data
                );

                addNotification(data);

            }

        },

        {
            noAck: true
        }
    );

}

const PORT =
    process.env.PORT || 3003;

app.listen(PORT, () => {

    console.log(
        `Notification Service rodando na porta ${PORT}`
    );

    consumeMessages();

});