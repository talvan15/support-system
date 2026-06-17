const express = require("express");
const cors = require("cors");

const db = require("./database");
const conectarRabbitMQ = require("./rabbitmq");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        servico: "message-service",
        status: "online"
    });
});

app.get("/mensagens", (req, res) => {

    db.all(
        `
        SELECT *
        FROM mensagens
        ORDER BY id DESC
        `,
        [],
        (erro, rows) => {

            if (erro) {
                return res.status(500).json({
                    erro: erro.message
                });
            }

            res.json(rows);

        }
    );

});

app.post("/mensagens", (req, res) => {

    const {
        sessaoId,
        cliente,
        mensagem
    } = req.body;

    db.run(
        `
        INSERT INTO mensagens
        (
            sessao_id,
            cliente,
            mensagem,
            data_envio
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            sessaoId,
            cliente,
            mensagem,
            new Date().toISOString()
        ],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: erro.message
                });
            }

            res.status(201).json({
                id: this.lastID,
                mensagem: "Mensagem salva"
            });

        }
    );

});

async function consumirMensagens() {

    try {

        const conexao =
            await conectarRabbitMQ();

        const canal =
            await conexao.createChannel();

        const fila =
            "mensagens_suporte";

        await canal.assertQueue(
            fila,
            {
                durable: true
            }
        );

        console.log(
            "Aguardando mensagens da fila..."
        );

        canal.consume(
            fila,
            (msg) => {

                if (!msg) return;

                try {

                    const dados =
                        JSON.parse(
                            msg.content.toString()
                        );

                    console.log(
                        "Mensagem recebida:",
                        dados
                    );

                    db.run(
                        `
                        INSERT INTO mensagens
                        (
                            sessao_id,
                            cliente,
                            mensagem,
                            data_envio
                        )
                        VALUES (?, ?, ?, ?)
                        `,
                        [
                            dados.sessaoId,
                            dados.cliente,
                            dados.mensagem,
                            dados.data ||
                            new Date().toISOString()
                        ]
                    );

                    canal.ack(msg);

                } catch (erro) {

                    console.error(
                        "Erro ao processar mensagem:",
                        erro
                    );

                }

            }
        );

    } catch (erro) {

        console.error(
            "Erro ao conectar RabbitMQ:",
            erro
        );

    }

}

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {

    console.log(
        `Servidor rodando na porta ${PORT}`
    );

    consumirMensagens();

});