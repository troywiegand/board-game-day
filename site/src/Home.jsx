import { useState, useEffect } from "react";
import { Link } from 'react-router';
function Home({socket, loggedInAs, setLoggedInAs}) {

    const [whoAmI,setWhoAmI] = useState('');
    const [people,setPeople] = useState(['Troy','Twix']);

    const joinTheGame = () => {
        setLoggedInAs(whoAmI);
    };

        useEffect(()=>{
        socket.on('players', (data) => {
            console.log({'players':data});
            setPeople(data);
        })

        return () => {
            socket.off('players');
        };
    },[setPeople, socket]);

    return (<>
        <h1>Game Day Home</h1>
        {!loggedInAs && <>
            <div className='score-maker'>

            <select onChange={e=>setWhoAmI(e.target.value)} value={whoAmI} id="realname" name="name">
            <option>Pick Person</option>
            {people.map(x=>(
                <option key={x} value={x}>{x}</option>
            ))}
        </select>

        <button className='game-button' onClick={joinTheGame}>Join the Game</button>

        </div>
        </>}

        {loggedInAs && <> <p> I am {loggedInAs} </p> </>}

        <div className='card location'>
            <Link to='/games'><div className='card game'><h2>Games List</h2></div></Link>
            <Link to='/gtw'><div className='card game'><h2>Green Team Wins</h2></div></Link>
        </div>
      <p>Scan Me to Get to the Site</p>
      <img className='pic' src='/frame.png'></img>
    </>)
    // TO-DO: Render Other players logged in
}

export default Home;
