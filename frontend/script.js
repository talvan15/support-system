const SUPPORT_API =
    "http://localhost:3001";

const MESSAGE_API =
    "http://localhost:3002";

const NOTIFICATION_API =
    "http://localhost:3003";

async function criarSessao() {

    try {

        const cliente =
            document.getElementById(
                "cliente"
            ).value;

        const response =
            await fetch(
                `${SUPPORT_API}/sessions`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({
                        customer: cliente
                    })
                }
            );

        const data =
            await response.json();

        document.getElementById(
            "sessaoId"
        ).value =
        data.id;

        alert(
            `Sessão ${data.id} criada com sucesso`
        );

    } catch (erro) {

        console.error(erro);

    }

}

async function enviarMensagem() {

    try {

        const sessionId =
            document.getElementById(
                "sessaoId"
            ).value;

        const customer =
            document.getElementById(
                "cliente"
            ).value;

        const message =
            document.getElementById(
                "mensagem"
            ).value;

        await fetch(
            `${SUPPORT_API}/messages`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    sessionId,
                    customer,
                    message
                })
            }
        );

        document.getElementById(
            "mensagem"
        ).value = "";

        carregarHistorico();
        buscarNotificacoes();

    } catch (erro) {

        console.error(erro);

    }

}

async function carregarHistorico() {

    try {

        const response =
            await fetch(
                `${MESSAGE_API}/mensagens`
            );

        const mensagens =
            await response.json();

        const historico =
            document.getElementById(
                "historico"
            );

        historico.innerHTML = "";

        mensagens.reverse().forEach(
            msg => {

                historico.innerHTML += `
                    <div class="card">

                        <h3>
                            ${msg.cliente}
                        </h3>

                        <p>
                            ${msg.mensagem}
                        </p>

                        <small>
                            Sessão:
                            ${msg.sessao_id}
                        </small>

                    </div>
                `;

            }
        );

    } catch (erro) {

        console.error(erro);

    }

}

async function buscarNotificacoes() {

    try {

        const response =
            await fetch(
                `${NOTIFICATION_API}/notifications`
            );

        const notificacoes =
            await response.json();

        const container =
            document.getElementById(
                "notificacoes"
            );

        container.innerHTML = "";

        notificacoes.reverse().forEach(
            item => {

                container.innerHTML += `
                    <div class="notificacao">

                        <strong>
                            ${item.customer}
                        </strong>

                        <p>
                            ${item.message}
                        </p>

                    </div>
                `;

            }
        );

    } catch (erro) {

        console.error(erro);

    }

}

async function limparHistorico() {

    await fetch(
        "http://localhost:3002/mensagens",
        {
            method: "DELETE"
        }
    );

    carregarHistorico();

}

carregarHistorico();
buscarNotificacoes();

setInterval(
    carregarHistorico,
    3000
);

setInterval(
    buscarNotificacoes,
    3000
);