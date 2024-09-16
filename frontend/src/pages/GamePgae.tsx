import '../App.css';
// import { Board} from "../components/Board";
// import { Popup } from '@repo/ui/Popup';
import { useRecoilState } from "recoil";
import { playerState } from "../atoms/atom";
import TicTacToe from '../components/TicTacToe';

export const GamePage = () => {
    const [player, _setPlayer] = useRecoilState(playerState);
    
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            {player !== "E" && 
                <div>
                    {player}
                </div>
            }
            <TicTacToe/>
        </div>
    );
};
