import { WebSocket } from "ws";
import { TicBoard, GameBoard } from "./Game";
import { makeTransaction } from "./utils/makeTransaction";

interface GamePlayerCollection {
    [key: string]: WebSocket[];
};

interface GameKeyPlayersCollection {
    [key: string]: string[];
};

interface GameCollection {
    [key: string]: TicBoard;
}

export class GameManager {
    private games: GameCollection = {};
    private gamesPlayers: GamePlayerCollection = {};
    private gamesPlayersKeys: GameKeyPlayersCollection = {};

    constructor() {
        this.games = {};
        this.gamesPlayers = {};
        this.gamesPlayersKeys = {};
    }

    handleMessages(socket: WebSocket) {
        socket.on("message", async (data) => {
            const message = JSON.parse(data.toString());

            if(message.type === "init_game") {
                const gameCode: string = message.gameCode;
                const publicKey: string = message.publicKey;

                // To check if code already in use
                if(this.games[gameCode]) {
                    socket.send(JSON.stringify({
                        type: "game_code_in_use"
                    }));
                    return;
                }

                if(!this.gamesPlayers[gameCode]) {
                    this.gamesPlayers[gameCode] = [];
                    this.gamesPlayersKeys[gameCode] = [];
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
                this.gamesPlayersKeys[gameCode]?.push(publicKey);
                const noOfPlayers = this.gamesPlayers[gameCode]?.length;

                if(noOfPlayers === 2) {
                    const gamePlayers = this.gamesPlayers[gameCode] || [];//-----------------------------------------
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
                    return;
                }
                
                const game = this.games[gameCode];

                const res = game?.makeMove(socket, move.player, move.position);
                if(res?.validMove==false) {
                    socket.send(JSON.stringify(res));
                    return;
                }
                gamePlayers[0]?.send(JSON.stringify(res));
                gamePlayers[1]?.send(JSON.stringify(res));

                if(res && res.gameEnds==true) {
                    let winnerPublicKey = [""];
                    if(res.winner=="O") {
                        winnerPublicKey.push(this.gamesPlayersKeys[gameCode][0]);
                    } else if(res.winner=="X") {
                        winnerPublicKey.push(this.gamesPlayersKeys[gameCode][1]);
                    } else {
                        winnerPublicKey.push(this.gamesPlayersKeys[gameCode][0]);
                        winnerPublicKey.push(this.gamesPlayersKeys[gameCode][1]);
                    }

                    makeTransaction(winnerPublicKey, 0.002);

                    delete this.gamesPlayers[gameCode];
                    delete this.games[gameCode];
                    delete this.gamesPlayersKeys[gameCode];
                }
            }
        });
    };
};