import {events, data} from './events.js';

class GTW {

static gameState = data.GTW.ADMIN.RESET_GAME;

static players = {};

static removePlayer = (socketID, socketIO) => {
   delete this.players[socketID]; 
   socketIO.emit(events.GTW.GAME_UPDATE, {type: data.GTW.LEADERBOARD, data: this.players});
};

static Sockets = (socketIO, socket) => {

    socket.on(events.GTW.JOIN_GAME, (d)=>{
        console.log("gtw - join game");
        console.log(socket.data);
        // Update DB to include player
        this.players[socket.id] = {player: d.player};
        // Emit current Game Info to all Players
        socketIO.emit(events.GTW.GAME_UPDATE, {
            type: data.GTW.LEADERBOARD, 
            data: this.players,
            gameState: this.gameState
        });
        socket.emit(events.GTW.GAME_UPDATE, {
            type: data.GTW.GAME_STATE, 
            gameState: this.gameState
        });
        console.log(this.players);
    });

    socket.on(events.GTW.SUBMIT, (d)=>{
        const submissionType = d.type;
        switch(submissionType){
            
            case data.GTW.PROMPT:
                console.log("Recieved Prompt from Captain");
                break;
            case data.GTW.SUBMITTED:
                console.log("Recieved Submission of Player");
                break;
            case data.GTW.ANSWERS:
                console.log("Captain wants to see Answers");
                break;
            case data.GTW.LEADERBOARD:
                console.log("Player was on the BLANK team");
                break;
            default:
                console.log(`ERROR: The submission ${submissionType} is not valid.`);
        };
    });
    
    socket.on(events.GTW.ADMIN_COMMANDS, (d)=>{
        const command = d.type;
        const commands = data.GTW.ADMIN;
        switch(command){
            
            case commands.RESET_GAME:
                console.log('Resetting Game');
                break;
            case commands.START_ROUND:
                console.log(`${socket.data.player} (${socket.id}) starting new GTW round`);
                socketIO.emit(events.GTW.GAME_UPDATE, {
                    type: data.GTW.GAME_STATE,
                    gameState: data.GTW.ADMIN.START_ROUND
                });
                break;
            case commands.END_ROUND:
                console.log('End Round');
                break;
            case commands.END_GAME:
                console.log('Ending Game');
                break;
            case commands.SCORE_GAME:
                console.log('Scoring Game');
                break;
            default:
                console.log(`Error: No ADMIN COMMAND ${command}`); 

        }

    });


    socket.on(events.DISCONNECT, (d) => {
        this.removePlayer(socket.id, socketIO);
    });

};

}

export default GTW;
