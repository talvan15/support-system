const amqp = require("amqplib");

async function conectarRabbitMQ() {
    try {
        const conexao = await amqp.connect(
            "amqp://guest:guest@127.0.0.1:5672"
        );

        console.log("Conectado ao RabbitMQ");

        return conexao;

    } catch (erro) {

        console.error(
            "Erro ao conectar RabbitMQ:",
            erro
        );

    }
}

module.exports = conectarRabbitMQ;