import { useEffect } from 'react';
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { socketState } from './atoms/atom';
import { Landing } from './pages/Landing';
import { GamePage } from './pages/GamePgae';
import { WalletConnect } from './components/WalletConnect';

function App() {
  const [_socket, setSocket] = useRecoilState(socketState);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setSocket(ws);
    };
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setSocket(null);
    };
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [setSocket]);

  return (
    <div style={{
      backgroundImage: "url('back.jpg')",
      position: 'sticky',
      top: '0px'
    }}>
      <div className="fixed top-2 right-2 rounded-full">
        <WalletConnect/>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/game' element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
