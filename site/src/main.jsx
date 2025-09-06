import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx';
import Gtw from './Gtw.jsx';
import Home from './Home.jsx';
import HomeBar from './HomeBar.jsx';
import './index.css'
import './App.css'
import { events } from 'board-game-day-server/events';
console.log({ events });
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
    const [activePlayers, setActivePlayers] = useState([]);
    const [possiblePlayers, setPossiblePlayers] = useState([]);

    useEffect(() => {

        socket.on('bgd - players', (data) => {
            console.log({bgdPlayers: data})
            setActivePlayers(data);
        })

        socket.on('players', (data) => {
            console.log({possiblePlayers: data})
            setPossiblePlayers(data);
        })

        return () => {
            loggedInAs !== '' && socket.emit('bgd - logoff', {player: loggedInAs});
            socket.off('bgd - players');
        }

    }, [setActivePlayers, setPossiblePlayers, socket, loggedInAs]);


    const loginHelper = (name) => {
            if (name === '') {
                socket.emit('bgd - logoff', {player: name});
                setLoggedInAs('');
            }
            else if (activePlayers.includes(name)){
                console.log(name, ' name already taken');
            } else {
                socket.emit('bgd - login', {player: name});
                setLoggedInAs(name);
            }
    }

    return (<>
      <HomeBar loggedInAs={loggedInAs} setLoggedInAs={loginHelper}/>
      <Routes>
        <Route path="/" element={<Home socket={socket} loggedInAs={loggedInAs} setLoggedInAs={loginHelper} />} />
        <Route path="/games" element={<App socket={socket} possiblePlayers={possiblePlayers} />} />
        <Route path="/gtw" element={<Gtw socket={socket} user={loggedInAs}/>} />
      </Routes>
      <>
        {activePlayers.length > 0 && (<>
            <h1>Active Players</h1>
            <p>
                {activePlayers.join('  ')}
            </p>
        </>)}
      </>
    </>)

}
