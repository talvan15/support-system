const API_URL =
    "http://localhost:3002";

async function enviarMensagem() {

    const sessaoId =
        document.getElementById(
            "sessaoId"
        ).value;

    const cliente =
        document.getElementById(
            "cliente"
        ).value;

    const mensagem =
        document.getElementById(
            "mensagem"
        ).value;

    if (
        !sessaoId ||
        !cliente ||
        !mensagem
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;
    }

    try {

        const resposta =
            await fetch(
                `${API_URL}/mensagens`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify({
                        sessaoId,
                        cliente,
                        mensagem
                    })
                }
            );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao enviar mensagem"
            );
        }

        document.getElementById(
            "mensagem"
        ).value = "";

        carregarMensagens();

    } catch (erro) {

        alert(
            "Erro ao enviar mensagem"
        );

        console.error(
            erro
        );

    }

}

async function carregarMensagens() {

    try {

        const resposta =
            await fetch(
                `${API_URL}/mensagens`
            );

        const mensagens =
            await resposta.json();

        const historico =
            document.getElementById(
                "historico"
            );

        historico.innerHTML = "";

        if (
            mensagens.length === 0
        ) {

            historico.innerHTML = `
                <p class="sem-mensagens">
                    Nenhuma mensagem encontrada
                </p>
            `;

            return;
        }

        mensagens.forEach(
            (msg) => {

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

        console.error(
            erro
        );

    }

}

carregarMensagens();

setInterval(
    carregarMensagens,
    3000
);