export async function movePiece(socket: WebSocket, player: string, position: number[],  gameCode: string){
    try {
        socket.send(JSON.stringify({
            type: "move",
            gameCode: gameCode,
            move: {
                player: player,
                position: position
            }
        }))
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}