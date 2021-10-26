// index.ts (server-side, entrypoint)
import http from 'http';
import { Server, Room } from 'colyseus';
import { MyRoom } from './rooms/MyRoom';

// create your game server
const gameServer = new Server({
    server: http.createServer()
});

// register your room handlers
gameServer.define('my_room', MyRoom);

// make it available to receive connections
gameServer.listen(2567);
console.log(`Listening on ws://localhost:2567`)