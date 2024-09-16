import { WebSocket } from "ws";

export type GameBoard = {
  type: string;
  validMove: boolean;
  chance: string;
  gameEnds: boolean;
  winner: string;
  board: string[][];
};

export class TicBoard {
  public gameCode: string;
  public gameBoard: string[][];
  public chance: string;
  public O: WebSocket | null;
  public X: WebSocket | null;

  constructor(gameCode: string) {
      this.gameCode = gameCode;
      this.gameBoard = [
          ["E", "E", "E"],
          ["E", "E", "E"],
          ["E", "E", "E"]
      ];
      this.chance = "O";
      this.O = null;
      this.X = null;
  }

  private checkWinner(player: string): boolean {
      // Checks for complete rows, columns, and diagonals
      for (let i = 0; i < 3; i++) {
          if (
              (this.gameBoard[i][0] === player && this.gameBoard[i][1] === player && this.gameBoard[i][2] === player) ||
              (this.gameBoard[0][i] === player && this.gameBoard[1][i] === player && this.gameBoard[2][i] === player)
          ) {
              return true;
          }
      }
      
      if (
          (this.gameBoard[0][0] === player && this.gameBoard[1][1] === player && this.gameBoard[2][2] === player) ||
          (this.gameBoard[0][2] === player && this.gameBoard[1][1] === player && this.gameBoard[2][0] === player)
      ) {
          return true;
      }
      
      return false;
  }

  public validMove(player: string, position: number[]): boolean {
      if (!player || !position || position.length !== 2) {
          return false;
      }
      const [row, col] = position;
      
      // If the new position is out of range
      if (row > 2 || col > 2 || row < 0 || col < 0) {
          return false;
      }
      
      // If position is already occupied
      if (this.gameBoard[row][col] !== "E") {
          return false;
      }

      return true;
  }

  public makeMove(socket: WebSocket, player: string, position: number[]): GameBoard {
      // Check if the correct player plays with correct socket
      if(player=="O" && this.O!=socket) {
        return { type: "move", validMove: false, chance: this.chance, gameEnds: false, winner: "E", board: this.gameBoard };
      }
      if(player=="X" && this.X!=socket) {
        return { type: "move", validMove: false, chance: this.chance, gameEnds: false, winner: "E", board: this.gameBoard };
      }

      // Check if the correct player plays
      if(this.chance!=player) {
        return { type: "move", validMove: false, chance: this.chance, gameEnds: false, winner: "E", board: this.gameBoard };
      }

      if (!this.validMove(player, position)) {
          return { type: "move", validMove: false, chance: this.chance, gameEnds: false, winner: "E", board: this.gameBoard };
      }

      const [row, col] = position;
      this.gameBoard[row][col] = player;
      this.chance = (this.chance=="O") ? "X" : "O";

      // Check if the current player wins
      if (this.checkWinner(player)) {
          return { type: "move", validMove: true, chance: this.chance, gameEnds: true, winner: player, board: this.gameBoard };
      }

      // Check if the game is a draw
      const isBoardFull = this.gameBoard.every(row => row.every(cell => cell !== "E"));
      if (isBoardFull) {
          return { type: "move", validMove: true, chance: this.chance, gameEnds: true, winner: "E", board: this.gameBoard };
      }

      // Game continues
      return { type: "move", validMove: true, chance: this.chance, gameEnds: false, winner: "E", board: this.gameBoard };
  }
}