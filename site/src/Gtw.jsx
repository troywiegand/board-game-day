import { useState, useEffect } from "react";
import { Link } from 'react-router';

function Gtw({socket, user}) {

    const [inTheGame, setInTheGame] = useState(user || false);
    const [thisRoundAnswer, setThisRoundAnswer] = useState('');
    const [roundAnswers, setRoundAnswers] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentTeam, setCurrentTeam] = useState('Orange');
    const [canSubmitScore, setCanSubmitScore] = useState(false);

    useEffect(()=>{
        socket.on('gtw - send', (data) => {
            console.log('getting answers')
            console.log(data);
            setRoundAnswers(data);
            setCanSubmitScore(true);
        })

        socket.on('gtw - leaderboardUpdate', (data) => {
            console.log('LEADERBOARD: ',data,Object.values(data))
            setLeaderboard(Object.values(data))
        })

        socket.on('gtw - reset round', (data) => {
            setThisRoundAnswer('');
            setRoundAnswers([]);
        })

        return () => {
            socket.off('gtw - send');
            socket.off('gtw - leaderboard');
            socket.off('gtw - reset round');
        };
    },[socket,setRoundAnswers,setLeaderboard])


    useEffect(()=>{
        socket.emit('gtw - join', {
            player: user
        });
        setInTheGame(true);
    },[socket,user]);

    const submitRoundAnswer = () => {
        socket.emit('gtw - collect',{thisRoundAnswer});
    }

    const endRound = () => {
        socket.emit('gtw - round end');
    }

    const startRound = () => {
        socket.emit('gtw - round start');
    }

    const scoreAnswer = (gOrO) => {
        return () => {
            setCurrentTeam(gOrO);
            socket.emit('gtw - round score', {player: user, team: gOrO});
            setCanSubmitScore(false);
        }
    }

    return (<>
        <h1>Green Team Wins</h1>
        {!inTheGame && <>
            <Link to='/'><div className='card game'><h2>Log in at Home page</h2></div></Link>
        </>}


        {inTheGame && <><div className="score-maker">
            <p>On the {currentTeam} Team</p>
            {inTheGame && (user==='Troy' || user==='Haley') && <>
            <h3>Admin Controls</h3>
            <button onClick={startRound}>Start Round</button><button  onClick={endRound} >Show Answers</button>
            <h3>Normal Game</h3>
            </>}
            <textarea value={thisRoundAnswer} onChange={e=>setThisRoundAnswer(e.target.value)}></textarea>
            <button onClick={submitRoundAnswer}>Submit Answer</button>
            <div className="card location">
                <h3>See Submitted Answers</h3>
            {roundAnswers.map(ans=>(<div key={ans}>
            <p>{ans}</p>
            </div>))}
            </div>
            {canSubmitScore && <><button onClick={scoreAnswer('Green')}>Green</button> <button onClick={scoreAnswer('Orange')}>Orange</button></>}
        </div>
        <div className="leaderboard">
        <h2>Leaderboard</h2>
        {
            leaderboard.length>0 && <table>
                <tbody>
                <tr>
                    <th>Name</th><th>Team</th><th>Score</th>
                </tr>
            {
                leaderboard.map((l)=>(
                    <tr key={l.player}>
                        <td>{l.player}</td>
                        <td>{l.lastTeam}</td>
                        <td>{l.score}</td>
                    </tr>
            ))
            }
                </tbody>
            </table>
        }
        </div>
        </>}
    </>)

}

export default Gtw;
