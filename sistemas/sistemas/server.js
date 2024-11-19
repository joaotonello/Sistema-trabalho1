const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 4000 });

const usuarios = [];
const tokensPermitidos = ['token123', 'token456']; // Lista de tokens válidos

server.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const token = params.get('token');

    if (!tokensPermitidos.includes(token)) {
        console.log('Tentativa de conexão negada: Token inválido.');
        ws.send(JSON.stringify({
            type: 'error',
            message: 'Conexão negada: Token inválido.'
        }));
        return ws.close(); // Fecha a conexão
    }

    console.log('Novo usuário conectado com token:', token);
    usuarios.push(ws);

    ws.send(JSON.stringify({
        type: 'notification',
        message: 'Você está conectado ao servidor!'
    }));

    usuarios.forEach(usuario => {
        if (usuario !== ws && usuario.readyState === WebSocket.OPEN) {
            usuario.send(JSON.stringify({
                type: 'notification',
                message: 'Alguém se conectou!'
            }));
        }
    });

    ws.on('message', (message) => {
        console.log(`Mensagem recebida: ${message}`);

        usuarios.forEach(usuario => {
            if (usuario !== ws && usuario.readyState === WebSocket.OPEN) {
                usuario.send(JSON.stringify({
                    type: 'message',
                    message: message
                }));
            }
        });
    });

    ws.on('close', () => {
        console.log('Usuário desconectado');
        const index = usuarios.indexOf(ws);
        if (index > -1) usuarios.splice(index, 1);

        usuarios.forEach(usuario => {
            if (usuario.readyState === WebSocket.OPEN) {
                usuario.send(JSON.stringify({
                    type: 'notification',
                    message: 'Um usuário se desconectou.'
                }));
            }
        });
    });
});
