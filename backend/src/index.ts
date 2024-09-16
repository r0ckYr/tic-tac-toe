import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';

import { GameManager } from './GameManager';

const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "hello"
    });
});

const httpServer = app.listen(3000);

const wss = new WebSocketServer({ server: httpServer });

const games = new GameManager();

wss.on('connection', function connection(socket) {
    games.handleMessages(socket);

    // socket.on('disconnect', () => games.removeUser(socket));

    socket.on('error', console.error);

    socket.send(`Connection made successfully`);
    console.log(`Connection made successfully`);
});