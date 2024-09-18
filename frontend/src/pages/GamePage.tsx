import '../App.css';
import { useRecoilState } from "recoil";
import { moneyState, codeState, winnerState } from "../atoms/atom";
import TicTacToe from '../components/TicTacToe';
import { WalletConnect } from '../components/WalletConnect';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentWait } from '../components/PaymentWait';

export const GamePage = () => {
    const [moneyDeposited] = useRecoilState(moneyState);
    const [code] = useRecoilState(codeState);
    const [winner] = useRecoilState(winnerState);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(code=='') {
            navigate('../');
        }
    });

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            {(winner==null) ? 
                (
                    (moneyDeposited) ? 
                        <TicTacToe/> : 
                        <WalletConnect/>
                ) : 
                (
                    <PaymentWait/>
                )
            }
        </div>
    );
};
