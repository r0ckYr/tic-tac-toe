import '../App.css';
import { useRecoilState } from "recoil";
import { codeState } from "../atoms/atom";
import TicTacToe from '../components/TicTacToe';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const GamePage = () => {
    const [code] = useRecoilState(codeState);
    const navigate = useNavigate();
    
    useEffect(() => {
        if(code=='') {
            navigate('../');
        }
    });

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <TicTacToe/>
        </div>
    );
};
