import { useState, useEffect } from 'react'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('QWERTYUIOPASDFGHJKLZXCVBNM', 4)


import socketIO from 'socket.io-client';
const socket = socketIO.connect(import.meta.env.VITE_SERVER);

import {games as GAMES} from './games.js';
import './App.css'

function App() {
  const [messages, setMessages] = useState(["abc"])
  const [currentGame, setCurrentGame] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState([]);
  const [score, updateScore] = useState(0);
  const [isJoining, setIsJoining] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const people = JSON.parse(import.meta.env.VITE_PEOPLE)

  useEffect(() => {
    socket.on('messageResponse', (data) => setMessages([...messages, data]));
  }, [messages]);

    const createNewGame = (e) => {
      e.preventDefault();
      setCurrentGame(nanoid());
    }

    const updateNumPlayers = (e) => {
      console.log(score)
      setNumberOfPlayers(e.target.value)
    }

    useEffect(()=>{
      let tempScore = []
      if(score.length>0) {
        tempScore = JSON.parse(JSON.stringify(score))
      }
      for(var i = 0; i < numberOfPlayers-score.length; i++) {
        const playerID = nanoid()
        tempScore.push({player: playerID, score: 0, name: playerID});
      }
      if(numberOfPlayers<score.length){
        for(var j = 0; j < score.length-numberOfPlayers; j++) {
          tempScore.pop();
        }
      }
      updateScore(JSON.parse(JSON.stringify(tempScore)))
      socket.emit('game', {
        score: tempScore,
        game: currentGame
      });
    },[numberOfPlayers, currentGame, updateScore])


    const updatePlayerScore = (playerID) => {
      return (e) => {
        const tempScore = JSON.parse(JSON.stringify(score))
        const where = tempScore.findIndex(x=>x.player===playerID)

        tempScore[where].score = Number.parseInt(e.target.value)
        updateScore(tempScore)
        socket.emit('game', {
          score: tempScore,
          game: currentGame
        });
      }
    }

    const selectName = (playerID) => {
      return (e) => {
        const tempScore = JSON.parse(JSON.stringify(score))
        const where = tempScore.findIndex(x=>x.player===playerID)
        tempScore[where].name = e.target.value
        updateScore(tempScore)
        socket.emit('game', {
          score: tempScore,
          game: currentGame
        });
      }
    }

    const activateJoining = () => {
      setIsJoining(!isJoining)
    }

    const updateJoinCode = (e) => {
      setJoinCode(e.target.value)
    }

    const joinGame = () => {
      setCurrentGame(joinCode)
      socket.emit('tryToJoinGame', {
        game: joinCode
      });
      socket.on('GameJoinStatus', (data) => {
        console.log({'GameJoinData':data, currentGame})
        if(data.game===joinCode){
          updateScore(data.score)
        }
      });
      setIsJoining(false)
    }

    useEffect(() => {
      socket.on('gameUpdate', (data) => {
        console.log({'gameUpdateData':data, currentGame})

        if(data.game===currentGame && data.score?.length>1){
          updateScore(data.score)
        }
      });
    }, [currentGame, updateScore]);

  return (
    <>
      <h1>September Board Game Day</h1>

      {Object.keys(GAMES).map(loc=>(
        <div className='card location' key={loc} id={loc}>
          <h2>{loc}</h2>
        {GAMES[loc].map(game=>(
          <div className="card game" id={game.gameName} key={game.gameName}>
            <h3>{game.gameName}</h3>
            {game.playerCount && <p>Players: {game.playerCount}</p>}
              <div>
              <a href={game.bggLink} target='_blank' rel='noreferrer' className='game-button bgg'>BGG</a>
              <a href={game.htpLink} target='_blank' rel='noreferrer' className='game-button htp'>HTP</a>
            </div>
          </div>
        ))}
        </div>
      ))}

      <>
      <div className='score-maker'> 
        {currentGame && <>
          <h2>Game Code: {currentGame}</h2>
          <h2>Players: <input type="number" min={2} max={people.length} value={numberOfPlayers} onChange={updateNumPlayers}></input></h2>
        </>}
        {isJoining && <p>
          <input type="text" min={4} max={8} value={joinCode} onChange={updateJoinCode}></input>
          <button onClick={joinGame}>Join This One</button>
        </p>}
        <button className='game-button' onClick={createNewGame}>Create Score Tracker</button>
        <button className='game-button' onClick={activateJoining}>Join Score Tracker</button>

      </div>
          
      {currentGame && <div className='score-holder'>
        {
          score.length>0 && score.map((v)=>(
            <>
            <div key={v.player} className="card score">
            <select onChange={selectName(v.player)} value={v.name} id="realname" name="name">
              {people.map(x=>(
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
            <input id='score-number' type="number" value={v.score} onChange={updatePlayerScore(v.player)}></input>
            </div>
            </>
          ))
        }

        </div>}
      </>
      <br/>
      <br/>
      <br/>
      {/*<p>Scan Me to Get to the Site</p>
      <img className='pic' src='/frame.png'></img>      
      <p>Scan Me to Get to the Wifi</p>
      <img className='pic' src='/wifi.png'></img>*/}
    </>
  )
}

export default App
