const amqp = require("amqplib");

async function enviar() {

    const conexao = await amqp.connect(
        "amqp://guest:guest@127.0.0.1:5672"
    );

    const canal = await conexao.createChannel();

    await canal.assertQueue(
        "mensagens_suporte"
    );

    canal.sendToQueue(
        "mensagens_suporte",
        Buffer.from(
            JSON.stringify({
                sessaoId: 1,
                cliente: "Alan",
                mensagem: "Mensagem de teste",
                data: new Date().toISOString()
            })
        )
    );

    console.log(
        "Mensagem enviada!"
    );

    setTimeout(() => {
        conexao.close();
        process.exit();
    }, 500);
}

enviar();