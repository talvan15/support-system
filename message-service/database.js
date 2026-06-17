

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
    "./mensagens.db",
    (erro) => {

        if (erro) {
            console.log(
                "Erro ao conectar ao banco",
                erro
            );
            return;
        }

        console.log(
            "Banco SQLite conectado"
        );
    }
);

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS mensagens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sessao_id INTEGER,
            cliente TEXT,
            mensagem TEXT,
            data_envio TEXT
        )
    `);

});

module.exports = db;