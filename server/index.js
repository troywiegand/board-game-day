require('dotenv').config();

let sqlite3 = require('sqlite3');
let sqlite = require('sqlite');
// this is a top-level await 
let db = null;
(async () => {
  // open the database
  db = await sqlite.open({
    filename: './score.sqlite',
    driver: sqlite3.Database
  })
})()
const express = require('express');
const app = express();
const PORT = 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: process.env.SITE
    }
});

const games = {};
// {name, points}
const leaderboard = {};

//Add this before the app.get() block
socketIO.on('connection', async (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    players = await db.all('SELECT player FROM leaderboard');
    socketIO.emit('players', players.map(x=>x.player));
    // Trigger Leaderboard Update on Clients
    mostRecentScore = await db.all('SELECT * FROM leaderboard');
    console.log(mostRecentScore)
    socketIO.emit('leaderboardUpdate',mostRecentScore.sort((x,y)=>y.score-x.score))

      socket.on('message', (data) => {
        socketIO.emit('messageResponse', data.text); 
      });

      socket.on('game', (data) => {
        if(data.score?.length>0){
            games[data.game] = data.score;
            socketIO.emit('gameUpdate', data);
        }
      });

      socket.on('tryToJoinGame', (data)=>{
        if(games[data.game]?.length>0){
            socketIO.emit('GameJoinStatus', {'game': data.game, 'score': games[data.game]});
        }
      });

      socket.on('submitGame', async (data)=>{
        // Sort Players into Game Score Buckets
        const tempScore = JSON.parse(JSON.stringify(data.score));
        const scoreDic = {};
        tempScore.forEach(x=>{
          if(x.score in scoreDic){
            scoreDic[x.score].push(x.name);
          } else {
            scoreDic[x.score] = [x.name];
          }
        })

        // Determine Leaderboard Scoring Based on Score Buckets
        let bucketScore = tempScore.length;
        Object.keys(scoreDic).sort((x,y)=>parseInt(y)-parseInt(x)).forEach(scoreTier=>{
          scoreDic[scoreTier].forEach(player=>{
            const i = tempScore.findIndex(x=>x.name===player);
            tempScore[i]= {...tempScore[i], leaderboardPointsEarned: bucketScore}
          })
          bucketScore -= scoreDic[scoreTier].length;
        })

        // Record Game Audit
        const q = `INSERT INTO playedGames (Game, "TimeStamp", ScoreObject) VALUES ('${data?.scoredGame || 'empty'}',"${Date.now()}",'${JSON.stringify(tempScore)}');`;
        await db.exec(q);
        
        // Determine Leaderboard Scores
        let recentScore = await db.all('SELECT * FROM leaderboard');
        tempScore.forEach(async (person,i) => {
          let dbEntry = recentScore.find(x=>x.player===person.name);
          await db.exec(`UPDATE leaderboard SET score=${dbEntry.score+person.leaderboardPointsEarned} WHERE player="${dbEntry.player}"`);
        });

        // Trigger Leaderboard Update on Clients
        mostRecentScore = await db.all('SELECT * FROM leaderboard');
        console.log(mostRecentScore)
        socketIO.emit('leaderboardUpdate',mostRecentScore.sort((x,y)=>y.score-x.score))
      })

    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});