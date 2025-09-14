const events = {};
const data = {};


// The event from SocketIO when a client connects
events.CONNECTION = 'connection';
events.DISCONNECT = 'disconnect';

events.LOGIN = 'login';
events.LOGOUT = 'logout';

// Get Updates about potential players
// Anyone that might be at this game
events.POTENTIAL_PLAYERS = 'potential_players';

// Get Updates about active players
// People who are "logged in"
events.ACTIVE_PLAYERS = 'active_players';

// Score Tracker Events
events.SCORE_TRACKER = {};

// When on the Games List Page the client will join a room
// This will hopefully make server code cleaner and enable using the same verbs
// This is probably not needed for ST due to sub trackers
// Namespaces might be better
events.SCORE_TRACKER.ROOM = 'st-room';

// When a user creates a score tracker in the Game Lists Page it will call out to server with a UUID
// It will create a new room with that UUID
events.SCORE_TRACKER.CREATE_GAME = 'st-create_game';

// Start Listener When Games List Page Join
// Only Recieve Events when in a uuid room
events.SCORE_TRACKER.JOIN_GAME = 'st-join_game';

// Start Listener When Games List Page Join
// Only Recieve NonLeaderboard Events when in a uuid room
events.SCORE_TRACKER.GAME_UPDATE = 'st-game_update';


data.SCORE_TRACKER = {};
data.SCORE_TRACKER.GAME_STATE = 'st-game_state';
data.SCORE_TRACKER.GAME_SUBMIT = 'st-game_submit';
data.SCORE_TRACKER.LEADERBOARD = 'st-leaderboard';

// GTW Events
events.GTW = {};
data.GTW = {};
data.GTW.ADMIN = {};
data.GTW.ADMIN.NEW_ROUND = 'gtw-admin-reset_game';

events.GTW.ROOM = 'gtw-room';

// GTW will only have one game instance at a time
// Someone with Admin Powers can progress the flow of the game
// Reset everything to 0, start a new prompt, end a question, send game results to ST
// Players that Submit in a round have the ability to gain points
// If Players miss a round they will stay on the team they were last on


// Fired when you hit a button on page.
// Adds you to the gtw-room
events.GTW.JOIN_GAME = 'gtw-join_game';

// When in GTW ROOM
// Prompt, # submitted, answers
// When Not in GTW ROOM Leaderboard Info data { type: "leaderboard", leaderboard: {} }
// This for the clients to recieve goodies
events.GTW.GAME_UPDATE = 'gtw-game_update';

data.GTW.PROMPT = 'gtw-prompt'; // promptType enum, promptQuestion string, promptAnswers []string ?
data.GTW.SUBMITTED = 'gtw-submitted'; // submittedCount num, playerCount num
data.GTW.ANSWERS = 'gtw-answers'; // answers []string, mostPopular string
data.GTW.LEADERBOARD = 'gtw-leaderboard'; // players []{name string, score num}
data.GTW.GAME_STATE = 'gtw-game_state';

//This is for the clients to give updates to the server
events.GTW.SUBMIT = 'gtw-submit';

events.GTW.ADMIN_COMMANDS = 'gtw-admin_commands';

data.GTW.ADMIN = {};

data.GTW.ADMIN.RESET_GAME = 'gtw-admin-reset_game';
data.GTW.ADMIN.START_ROUND = 'gtw-admin-start_round'; // promptType enum, promptQuestion string
data.GTW.ADMIN.END_ROUND = 'gtw-admin-new_round';
data.GTW.ADMIN.END_GAME = 'gtw-admin-end_game';
data.GTW.ADMIN.SCORE_GAME = 'gtw-admin-score_game';



export { events, data };






