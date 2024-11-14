import { useEffect } from 'react';
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { socketState } from './atoms/atom';
import { Landing } from './pages/Landing';
import { GamePage } from './pages/GamePage';
const BACKENDURL = process.env.BACKENDURL || 'localhost:3000';

function App() {
  const [_socket, setSocket] = useRecoilState(socketState);

  useEffect(() => {
    // const ws = new WebSocket('ws://localhost:3000');
    const ws = new WebSocket('ws://'+BACKENDURL);
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
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{
        backgroundImage: "url('back.jpg')",
        position: 'fixed',
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'cover',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '-1'
      }} />
      
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
