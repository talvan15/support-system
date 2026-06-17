const app = require('./app');
const { connectRabbit } = require('./config');

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await connectRabbit();

        app.listen(PORT, () => {
            console.log(`Support Service rodando na porta ${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar o Support Service:', error.message);
        process.exit(1);
    }
}

startServer();