import '../App.css';
import { initGame } from '../backendCalls/initGame';
import { useNavigate } from 'react-router-dom';
import { codeState, socketState, playerState, publicKeyState } from '../atoms/atom';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { getJWT, removeJWT } from '../utils/jwt-storage';
import { verifyToken } from '../utils/ verify-tokens';

export const Landing = () => {
    const [_publicKey, setPublicKey] = useRecoilState(publicKeyState);
    const [code, setCode] = useRecoilState(codeState);
    const [socket, _setSocket] = useRecoilState(socketState);
    const [_player, setPlayer] = useRecoilState(playerState);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value);
    };

    useEffect(() => {
        const verify = async () => {
          try {
            const token = getJWT();
            if (token == null) {
                window.location.href = "https://nixarcade.fun";
                return;
            }
            const data = await verifyToken(token, "apisecret");
            if (data == null || data.verified == false) {
              window.location.href = "https://nixarcade.fun";
            } else {
              setPublicKey(data.publicKey);
              removeJWT();
            }
          } catch (e) {
            console.error("Error verifying token:", e);
            alert("Token Verification Failed");
            window.location.href = "https://nixarcade.fun";
            console.log(e);
          }
        };
        verify();
      }, []);

    const triggerPopup = () => {
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false); // Hide popup after 5 seconds
        }, 2000);
    };

    useEffect(() => {
        if (!socket) return;
        const handleMessage = (event: { data: { toString: () => string; }; }) => {
            try {
                const message = JSON.parse(event.data.toString());
                console.log('Message from server:', message);
              
                if (message.type === "init_game") {
                  setPlayer(message.payload.player);
                  navigate('/game');
                }
                else if (message.type === "game_code_in_use") {
                    setPopupMessage("Game code already in use!!");
                    triggerPopup();
                }
                else if(message.type === "waiting_for_players") {
                    setPopupMessage("Waiting for other players to join!!");
                    triggerPopup();
                }
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
        };

        socket.onmessage = handleMessage;
    }, [socket, setPlayer, navigate]);

    return (
        <>
            {showPopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-slate-700 bg-opacity-5 rounded shadow-lg">
                    <p className="font-custom font-color2 text-3xl">{popupMessage}</p>
                </div>
            )}
            <div className='flex flex-col pb-10 h-screen'>
                <div className='flex flex-row justify-center'>
                    <div className='text-center'>
                        <img className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto' src='tictactoe.png' alt='Icon'/>
                        <h1 className='font-custom font-color text-5xl' >Welcome to Tic Tac Toe</h1>
                    </div>
                </div>
                <div className='flex flex-row justify-center mt-16'>
                    <p className='font-custom font-color text-3xl mr-20'>Enter the code: </p>
                    <input 
                        className='bg-black font-custom font-color text-3xl border-2 rounded'
                        onChange={(e)=>{
                            handleChange(e);
                        }}
                        />
                </div>
                <div className='flex flex-row justify-center mt-16'>
                    <button 
                        type='button' 
                        className='font-custom font-color text-3xl p-4 focus:outline-none rounded-full border hover:bg-black'
                        onClick={()=>{
                            if(!socket) return;
                            initGame(socket, code);
                        }}
                        >
                        Enter Game
                    </button>
                </div>
            </div>
        </>
    );
}