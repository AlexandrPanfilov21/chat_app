const http = require('http');
const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer();
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());

// Пример обработки POST-запроса на /login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Здесь можно добавить логику проверки данных
    if (username === 'admin' && password === 'admin') {
        return res.status(200).json({ token: 'fake-jwt-token' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);

        // Преобразуем сообщение в объект
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (error) {
            console.error('Error parsing message:', error);
            return; // Если ошибка, прекращаем выполнение
        }

        // Обрабатываем тип сообщения
        switch (parsedMessage.type) {
            case 'message':
                console.log(`New message in channel ${parsedMessage.channel_id}: ${parsedMessage.content}`);
                // Отправляем сообщение обратно всем клиентам
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(parsedMessage));
                    }
                });
                break;

            case 'channel_created':
                console.log(`Creating new channel: ${parsedMessage.name}`);
                console.log(parsedMessage);
                // Логика для создания канала (можно обновить БД или список каналов)
                // Отправляем обратно подтверждение о создании канала
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(parsedMessage));
                    }
                });
                break;

            default:
                console.log('Unknown message type:', parsedMessage.type);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(8080, () => {
    console.log('WebSocket server is running on ws://localhost:8080');
});
