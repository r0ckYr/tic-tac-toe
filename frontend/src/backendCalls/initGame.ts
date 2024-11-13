export async function initGame(socket: WebSocket, gameCode: string, publicKey: string){
    try {
        socket.send(JSON.stringify({
            type: "init_game",
            gameCode: gameCode,
            publicKey: publicKey
        }))
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}