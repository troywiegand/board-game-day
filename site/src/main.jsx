import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx';
import Gtw from './Gtw.jsx';
import Home from './Home.jsx';
import HomeBar from './HomeBar.jsx';
import './index.css'

import socketIO from 'socket.io-client';
const socket = socketIO.connect(import.meta.env.VITE_SERVER);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GameRoutes socket={socket}/>
    </BrowserRouter>
  </React.StrictMode>,
)


function GameRoutes({socket}) {

    const [loggedInAs, setLoggedInAs] = useState('');

    return (<>
      <HomeBar loggedInAs={loggedInAs} setLoggedInAs={setLoggedInAs}/>
      <Routes>
        <Route path="/" element={<Home socket={socket} loggedInAs={loggedInAs} setLoggedInAs={setLoggedInAs} />} />
        <Route path="/games" element={<App socket={socket}/>} />
        <Route path="/gtw" element={<Gtw socket={socket} user={loggedInAs}/>} />
      </Routes>
    </>)

}
