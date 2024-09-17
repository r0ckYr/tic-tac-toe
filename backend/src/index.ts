import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';

import { GameManager } from './GameManager';
const verifyPayment = require('./routes/verifyPayment');

const app = express();

// middlewares
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
    credentials: true                // Allow credentials like cookies, authorization headers
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