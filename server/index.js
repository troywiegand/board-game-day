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
    players = await db.all('SELECT player FROM scores');
    socketIO.emit('players', players.map(x=>x.player));

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
        console.log(data)
        const tempScore = JSON.parse(JSON.stringify(data.score));
        mostRecentScore = await db.all('SELECT * FROM scores');
        tempScore.sort((x,y)=>y.score-x.score)
        console.log(tempScore)
        tempScore.forEach(async (person,i) => {
          if(!!!leaderboard[person.name]){
            leaderboard[person.name]= {firstName: person.name, overallScore: tempScore.length-i, gameList: [{game: data.scoredGame, rank: i}]};
          } else {
            leaderboard[person.name].overallScore = (leaderboard[person.name].overallScore||0)+tempScore.length-i;
            leaderboard[person.name].gameList= [...leaderboard[person.name].gameList, {game: data.scoredGame, rank: i}];
          }
          let dbEntry = mostRecentScore.find(x=>x.player===person.name);
          await db.exec(`UPDATE scores SET score=${dbEntry.score+tempScore.length-i} WHERE player="${dbEntry.player}"`);
        });

        socketIO.emit('leaderboardUpdate',Object.values(leaderboard).sort((x,y)=>y.overallScore-x.overallScore))
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