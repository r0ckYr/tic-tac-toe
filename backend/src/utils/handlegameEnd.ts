import { deleteGameAndPlayers, getWalletAddress } from "../database/databaseFunctions";
import { GameBoard } from "../Game";
import { transfer } from "../utils/Transfer";

const handleTransfer = async (res: GameBoard, gameCode: string): Promise<boolean> => {
    if(!res) return false;

    if(res.gameEnds && res.winner=='E') {
        const player1WalletAddress = await getWalletAddress(gameCode, 'O');
        const player2WalletAddress = await getWalletAddress(gameCode, 'X');
        if(player1WalletAddress==null || player2WalletAddress==null) {
            return false;
        }

        const player1success = await transfer(player1WalletAddress, 0.1);
        const player2success = await transfer(player2WalletAddress, 0.1);
        if(!player1success||!player2success) return false;
        // handle this case better
    }

    if(res.gameEnds && res.winner!='E') {
        const playerWalletAddress = await getWalletAddress(gameCode, res.winner);
        if(playerWalletAddress==null) return false;

        const success = await transfer(playerWalletAddress, 0.2);
        if(!success) return false;
    }

    return true;
};

export const handleGameEnd = async (res: GameBoard, gameCode: string): Promise<boolean> => {
    const successTransfer = handleTransfer(res, gameCode);
    console.log("game ends: " + successTransfer);
    if(!successTransfer) return false;

    const deleteSuccess = deleteGameAndPlayers(gameCode);
    if(!deleteSuccess) return false;
    return true;
};
