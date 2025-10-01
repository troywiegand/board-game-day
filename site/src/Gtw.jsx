import { useState, useEffect } from "react";
import { Link } from 'react-router';
import { events, data } from 'board-game-day-server/events';

function Gtw({socket, user}) {

    const [inTheGame, setInTheGame] = useState(user!=='' || false);
    const [myAnswer, setMyAnswer] = useState('');
    const [roundAnswers, setRoundAnswers] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentTeam, setCurrentTeam] = useState('Orange');
    const [hasSubmit, setHasSubmit] = useState(false);
    const [canSubmitScore, setCanSubmitScore] = useState(false);
    const [currentGameState, setCurrentGameState] = useState('');
    const [submittedCount, setSubmittedCount] = useState(0);
    const [playerCount, setPlayerCount] = useState(0);
    //TO-DO: Populate this from server
    const isAdmin = (user === 'Troy' || user === 'Haley');

    useEffect(()=>{
        socket.on(events.GTW.GAME_UPDATE, (d) => {
            switch(d.type){
                case data.GTW.GAME_STATE:
                    console.log("GS UPDATE", d);
                    setCurrentGameState(d.gameState);
                    if (d.gameState === data.GTW.ADMIN.END_ROUND){
                        setCanSubmitScore(true);
                    }
                    // Certain Game States should cause certain game state to change
                    break;
                case data.GTW.PROMPT:
                    // Update the Prompt (And Type)
                    break;
                case data.GTW.SUBMITTED:
                    // Submitted Count / Did I submit Info
                    console.log("SUB UPDATE", d);
                    setSubmittedCount(d.data.submittedCount);
                    setPlayerCount(d.data.playerCount);
                    break;
                case data.GTW.ANSWERS:
                    // Show Displayed Answers
                    break;
                case data.GTW.LEADERBOARD:
                    // Update the leaderboard / Active Players
                    break;
                default:
                    console.log(`ERROR: Client can not handle type ${d.type}`);
            }
        })

        return () => {
            socket.off(events.GTW.GAME_UPDATE);
        };
    },[socket,setRoundAnswers,setLeaderboard])


    useEffect(()=>{
            if (user!=='') {
            socket.emit(events.GTW.JOIN_GAME, {
                player: user
            });
            setInTheGame(true);
            } else {
            setInTheGame(false);
            }
    },[socket,user,setInTheGame]);

    // Every Player

    const submitRoundAnswer = () => {
        socket.emit(events.GTW.SUBMIT,{
            type: data.GTW.SUBMITTED,
            myAnswer
        });
        setHasSubmit(true);
    }
    
    const scoreAnswer = (gOrO) => {
        return () => {
            setCurrentTeam(gOrO);
            socket.emit(events.GTW.SUBMIT, {
                type: data.GTW.LEADERBOARD,
                player: user, 
                team: gOrO
            });
            setCanSubmitScore(false);
        }
    }

    // Captain Emits
    
    const sendPrompt = () => {
        return () => {
            socket.emit(events.GTW.SUBMIT, {
                type: data.GTW.PROMPT,
                player: user, 
            });
        }
    }
    
    const showAnswers = () => {
        return () => {
            socket.emit(events.GTW.SUBMIT, {
                type: data.GTW.ANSWERS,
                player: user, 
            });
        }
    }


    // ADMIN COMMANDS

    // Captain can End a Round
    // An Admin Then Determines if there's to be more play
    const endRound = () => {
        if (isAdmin || isCaptain) {
            socket.emit(events.GTW.ADMIN_COMMANDS, {
                type: data.GTW.ADMIN.END_ROUND,
                "message": "Hi from server"
            });
            
        }
    };

    const startRound = () => {
        if (isAdmin) {
            socket.emit(events.GTW.ADMIN_COMMANDS, {
                type: data.GTW.ADMIN.START_ROUND,
                "message": "Hi from server"
            });
        }
    };
    
    const endGame = () => {
        if (isAdmin) {

        }
    };

    // If Game is Over we can reset it or score it

    // TO-DO Add Those Event Handlers

    return (<>
        <h1>Green Team Wins</h1>
        {!inTheGame && <>
            <Link to='/'><div className='card game'><h2>Log in at Home page</h2></div></Link>
        </>}

        {inTheGame && isAdmin && <><div className="score-maker">
            <h3>Admin Controls</h3>
            {currentGameState===data.GTW.ADMIN.RESET_GAME && <button onClick={startRound}>Start Game</button>}
            {currentGameState===data.GTW.ADMIN.START_ROUND && <><p>Player(s) Submitted: {submittedCount} / {playerCount}</p><button  onClick={endRound}>Show Answers</button></>}
            {currentGameState===data.GTW.ADMIN.END_ROUND && <button  onClick={startRound}>New Round</button>}
            {currentGameState===data.GTW.ADMIN.END_ROUND && <button  onClick={endGame}>End Game</button>}
            {currentGameState===data.GTW.ADMIN.END_GAME && <button  onClick={scoreGame}>Score Game</button>}
            {currentGameState===data.GTW.ADMIN.END_GAME && <button  onClick={startRound}>Start New Game</button>} 
        </div></>}

        {inTheGame && <><div className="score-maker">
            <p>On the {currentTeam} Team</p>
            {currentGameState===data.GTW.ADMIN.START_ROUND && !hasSubmit && <>
            <textarea value={myAnswer} onChange={e=>setMyAnswer(e.target.value)}></textarea>
            <button onClick={submitRoundAnswer}>Submit Answer</button>
            </>}
            {currentGameState===data.GTW.ADMIN.START_ROUND && hasSubmit && <>
                    <p>Answer Submitted!</p>
            </>}
            {currentGameState===data.GTW.ADMIN.END_ROUND && <div className="card location">
                <h3>See Submitted Answers</h3>
            {roundAnswers.map(ans=>(<div key={ans}>
            <p>{ans}</p>
            </div>))}
            </div>}
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
