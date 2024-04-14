require('dotenv').config();
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

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

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