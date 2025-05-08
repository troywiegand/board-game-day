import { useState, useEffect } from "react";
import { Link } from 'react-router';
function Home({socket, loggedInAs, setLoggedInAs}) {

    const [whoAmI,setWhoAmI] = useState('');

    const joinTheGame = () => {
        setLoggedInAs(whoAmI);
    };

    return (<>
        <h1>Game Day Home</h1>
        {!loggedInAs && <>
            <div className='score-maker'>

        <input type='text' onChange={e=>setWhoAmI(e.target.value)} value={whoAmI} id="realname" name="name">
        </input>

        <button className='game-button' onClick={joinTheGame}>Join the Game</button>

        </div>
        </>}

        {loggedInAs && <> <p> I am {loggedInAs} </p> </>}

        <div className='card location'>
            <Link to='/games'><div className='card game'><h2>Games List</h2></div></Link>
            <Link to='/gtw'><div className='card game'><h2>Green Team Wins</h2></div></Link>
        </div>
    </>)
    // TO-DO: Render Other players logged in
}

export default Home;
