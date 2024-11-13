import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { codeState, playerState, socketState, winnerState } from '../atoms/atom';
import { useNavigate } from 'react-router-dom';
import WinnerPopup from './WinnerPop';

const xImage = 'X.png';
const oImage = 'O.png';
const none = 'none.png';

const TicTacToe = () => {
    const [code] = useRecoilState(codeState);
    const [player] = useRecoilState(playerState);
    const [socket] = useRecoilState(socketState);
    const [winner, setWinner] = useRecoilState(winnerState);

    const [showInvalidPopup, setShowInvalidPopup] = useState(false);
    const [board, setBoard] = useState<string[][]>([
        ["E", "E", "E"],
        ["E", "E", "E"],
        ["E", "E", "E"]
    ]);
    const [currPlayer, setCurrPlayer] = useState<string>("O");
    const navigate = useNavigate();

    const triggerPopup = () => {
        setShowInvalidPopup(true);
        setTimeout(() => {
            setShowInvalidPopup(false);
        }, 2000);
    };

    useEffect(() => {
        if (!socket) {
            navigate("../");
            return;
        }

        const handleMessage = (event: { data: string }) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === "move") {
                    if (message.validMove === true) {
                        console.log("message received"+ message.board);
                        setBoard(message.board);
                        setCurrPlayer(message.chance);
                        if(message.gameEnds) {
                            if(message.winner!="E") {
                                setWinner("Winner: " + message.winner);

                            } else {
                                setWinner("Draw");
                            }
                        }
                    } else {
                        triggerPopup();
                    }
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        socket.onmessage = handleMessage;

        return () => {
            socket.onmessage = null;
        };
    }, [socket]);

    const handleSquareClick = (i: number, j: number) => {
        if(board[i][j]!=="E") {
            triggerPopup();
            return;
        }
        if (socket) {
            socket.send(JSON.stringify({
                type: "move",
                gameCode: code,
                move: {
                    player: player,
                    position: [i, j]
                }
            }));
        } else {
            navigate("../");
        }
    }

    const renderSquare = (i: number, j: number) => (
        <button
            className="w-24 h-24 bg-transparent border-2 border-slate-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-100 hover:bg-opacity-20"
            onClick={() => {
                handleSquareClick(i, j);
            }}
        >
            {board && board[i][j] && (
                <img 
                    src={(board[i][j] === "E") ? none : ((board[i][j] === "O") ? oImage : xImage)} 
                    alt={board[i][j]} 
                    className="w-16 h-16 object-contain"
                />
            )}
        </button>
    );

    return (
        <>
            {(winner) ? <WinnerPopup player={winner}/> : 
                <>
                    {showInvalidPopup && (
                        <div className="left-2 top-2 p-4 bg-slate-700 bg-opacity-5 rounded shadow-lg">
                            <p className="font-custom font-color2 text-3xl">Invalid move!!</p>
                        </div>
                    )}
                    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
                        <h1 className="text-8xl font-bold mb-8 font-custom font-color2">Tic Tac Toe</h1>
                        <div className="grid grid-cols-3 gap-4 mb-4 p-4 rounded-xl backdrop-filter backdrop-blur-sm">
                            {board && board.map((row, i) => 
                                row.map((_, j) => renderSquare(i, j))
                            )}
                        </div>
                        {winner ? (
                            <div className="text-4xl font-bold mb-4 font-custom font-color">{winner}</div>
                        ) : (
                            <div className="text-4xl font-bold mb-4 font-custom font-color">
                                {currPlayer === player ? "Your turn" : "Opponent's turn"}
                            </div>
                        )}
                        <div className="text-2xl font-bold mb-4 font-custom font-color2">You are: {player}</div>
                        <div className="text-2xl font-bold mb-4 font-custom font-color3">Game Code: {code}</div>
                    </div>
                </>
            }
        </>
    );
};

export default TicTacToe;