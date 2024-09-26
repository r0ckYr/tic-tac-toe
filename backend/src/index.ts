import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';

import { GameManager } from './GameManager';
const verifyPayment = require('./routes/verifyPayment');

const app = express();

// middlewares
app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        callback(null, origin || '*'); // Allow all origins
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

app.get("/", (req, res) => {
    res.json({
        message: "hello"
    });
});
app.use("/api", verifyPayment);

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