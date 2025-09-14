import {config} from 'dotenv';
config();

import sqlite3 from 'sqlite3';
import {open as sqliteOpen} from 'sqlite';
// this is a top-level await 
let db = null;
(async () => {
  // open the database
  db = await sqliteOpen({
    filename: './score.sqlite',
    driver: sqlite3.Database
  })
})()
import express from 'express';
const app = express();
const PORT = 4000;

//New imports
import http from 'http';
const httpServer = http.Server(app);
import cors from 'cors';
import { Server } from 'socket.io';

const corsSite = process.env.SITE;

console.log(corsSite);

app.use(cors());

const socketIO = new Server(httpServer, {
    cors: {
        origin: [corsSite, 'http://localhost:5173']
    }
});

import { events } from './src/events.js';
import GTW from './src/GTW.js';

//Add this before the app.get() block
socketIO.on('connection', async (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on(events.LOGIN, (d) => {
        socket.data.player = d.player;
        //console.log({d, sdp: socket.data.player});
    });
    
    GTW.Sockets(socketIO, socket);

    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected', socket.id);
    });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
