import { useState, useEffect } from "react";
function Gtw({socket}) {

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
            socket.emit('gtw - round score', {player: whoAmI, team: gOrO});
            setCanSubmitScore(false);
        }
    }

    return (<>
        <h1>Green Team Wins</h1>
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


        {inTheGame && <><div className="score-maker">
            <p>Playing as {whoAmI} on the {currentTeam} Team</p>
            {inTheGame && (whoAmI==='Troy' || whoAmI==='Haley') && <>
            <button onClick={startRound}>Start Round</button><button  onClick={endRound} >Show Answers</button>
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