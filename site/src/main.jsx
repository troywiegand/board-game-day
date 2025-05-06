import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx';
import Gtw from './Gtw.jsx';
import Home from './Home.jsx';
import './index.css'

import socketIO from 'socket.io-client';
const socket = socketIO.connect(import.meta.env.VITE_SERVER);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home socket={socket}/>} />
        <Route path="/games" element={<App socket={socket}/>} />
        <Route path="/gtw" element={<Gtw socket={socket}/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
