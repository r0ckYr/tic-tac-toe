import { useRecoilState } from "recoil"
import { socketState, winnerState } from "../atoms/atom"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const PaymentWait = () => {
    const [socket] = useRecoilState(socketState);
    const [winner, setWinner] = useRecoilState(winnerState);
    const [transfer, setTransfer] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) {
            navigate("../");
            return;
        }

        const handleMessage = (event: { data: string }) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === "transfer_success") {
                    setTransfer(true);
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

    return(
        <div>
            <p className="font-custom font-color2 text-3xl">Winner is {winner}</p>
            {(transfer==true) ? 
                <div className="left-2 top-2 p-4 bg-slate-700 bg-opacity-5 rounded shadow-lg">
                    <p className="font-custom font-color2 text-3xl">Transfer has been completed</p>
                </div> : 
                <div className="left-2 top-2 p-4 bg-slate-700 bg-opacity-5 rounded shadow-lg">
                    <p className="font-custom font-color2 text-3xl">
                        Wait for transfer to complete
                        <div className="spinner"></div>
                    </p>
                </div>
            }
        </div>
    )
}