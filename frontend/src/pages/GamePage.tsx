import '../App.css';
import { useRecoilState } from "recoil";
import { playerState, moneyState } from "../atoms/atom";
import TicTacToe from '../components/TicTacToe';
import { WalletConnect } from '../components/WalletConnect';

export const GamePage = () => {
    const [player, _setPlayer] = useRecoilState(playerState);
    const [moneyDeposited] = useRecoilState(moneyState);
    
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            {player !== "E" && 
                <div>
                    {player}
                </div>
            }
            {(moneyDeposited) ? 
                <TicTacToe/> : 
                <WalletConnect/>}
        </div>
    );
};
