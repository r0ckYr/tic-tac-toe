import { WebSocket } from "ws";
import { TicBoard, GameBoard } from "./Game";

interface GamePlayerCollection {
    [key: string]: WebSocket[];
};

interface GameCollection {
    [key: string]: TicBoard;
}

export class GameManager {
    private games: GameCollection = {};
    private gamesPlayers: GamePlayerCollection = {};

    constructor() {
        this.games = {};
        this.gamesPlayers = {};
    }

    handleMessages(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if(message.type === "init_game") {
                const gameCode: string = message.gameCode;

                // To check if code already in use
                if(this.games[gameCode]) {
                    socket.send(JSON.stringify({
                        type: "game_code_in_use"
                    }));
                    return;
                }

                if(!this.gamesPlayers[gameCode]) {
                    this.gamesPlayers[gameCode] = [];
                }

                // If the user (socket) already exists
                const playerExists = this.gamesPlayers[gameCode].some(value => value === socket);
                
                if (playerExists) {
                    socket.send(JSON.stringify({
                        type: "waiting_for_players"
                    }));
                    return; // Stop further execution
                }

                this.gamesPlayers[gameCode]?.push(socket);
                const noOfPlayers = this.gamesPlayers[gameCode]?.length;

                if(noOfPlayers === 2) {
                    const gamePlayers = this.gamesPlayers[gameCode] || [];
                    const game = new TicBoard(gameCode);
                    gamePlayers[0]?.send(JSON.stringify({
                        type: "init_game",
                        payload: {
                            player: "O"
                        }
                    }));
                    gamePlayers[1]?.send(JSON.stringify({
                        type: "init_game",
                        payload: {
                            player: "X"
                        }
                    }));
                    game.O = gamePlayers[0];
                    game.X = gamePlayers[1];
                    this.games[gameCode] = game;
                }
            }

            if(message.type === "move") {
                const move = message.move;
                const gameCode = message.gameCode;
                const gamePlayers = this.gamesPlayers[gameCode];
                // If player doesn't match
                if(gamePlayers[0]!=socket && gamePlayers[1]!=socket) {
                    socket.send(JSON.stringify({
                        type: "invalid_access"
                    }));
                }
                
                const game = this.games[gameCode];

                const res = game?.makeMove(socket, move.player, move.position);
                if(res?.validMove==false) {
                    socket.send(JSON.stringify(res));
                }
                if(gamePlayers[0]!=socket) gamePlayers[0]?.send(JSON.stringify(res));
                if(gamePlayers[1]!=socket) gamePlayers[1]?.send(JSON.stringify(res));

                if(res?.gameEnds==true) {
                    delete this.gamesPlayers[gameCode];
                    delete this.games[gameCode];
                }
            }
        });
    };
};