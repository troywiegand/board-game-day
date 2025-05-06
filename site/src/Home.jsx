import { useState, useEffect } from "react";
import { Link } from 'react-router';
function Home({socket}) {

    const [people,setPeople] = useState(JSON.parse(import.meta.env.VITE_PEOPLE));
    const [whoAmI,setWhoAmI] = useState('');
    const [inTheGame, setInTheGame] = useState(false);
    const [thisRoundAnswer, setThisRoundAnswer] = useState('');
    const [roundAnswers, setRoundAnswers] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentTeam, setCurrentTeam] = useState('Orange');
    const [canSubmitScore, setCanSubmitScore] = useState(false);

    useEffect(()=>{
        socket.on('gtw - players', (data) => {
            console.log({'players':data});
            setPeople(data);
        })

        socket.on('gtw - send', (data) => {
            console.log('getting answers')
            console.log(data);
            setRoundAnswers(data);
            setCanSubmitScore(true);
        })

        socket.on('gtw - leaderboard', (data) => {
            console.log('LEADERBOARD: ',data,Object.values(data))
            setLeaderboard(Object.values(data))
        })

        socket.on('gtw - reset round', (data) => {
            setThisRoundAnswer('');
            setRoundAnswers([]);
        })

        return () => {
            socket.off('gtw - players');
            socket.off('gtw - send');
            socket.off('gtw - leaderboard');
            socket.off('gtw - reset round');
        };
    },[setPeople,setRoundAnswers,setLeaderboard])

    const joinTheGame = () => {
        socket.emit('gtw - join', {
            player: whoAmI
        });
        setInTheGame(true);
    }


    return (<>
        <h1>Game Day Home</h1>
        {!inTheGame && <>
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

        <div className='card location'>
            <Link to='/games'><div className='card game'><h2>Games List</h2></div></Link>
            <Link to='/gtw'><div className='card game'><h2>Green Team Wins</h2></div></Link>
        </div>
    </>)

}

export default Home;
