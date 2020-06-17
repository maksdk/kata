const path = require('path');
const Express = require('express');
const config = require('../config.json');
const expressApp = Express();
const httpServer = require('http').createServer(expressApp);
const socketIO = require('socket.io')(httpServer);

const PORT = config.port;
const pool = new Map();

expressApp.use(Express.static(path.join(__dirname, '../dist/client')));

socketIO.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    pool.set(socket.id, socket);

    socket.on('disconnect', disconnect.bind(null, socket));
    socket.on('move', move.bind(null, socket));
    socket.on('stop', stop.bind(null, socket));
});

// function connect(socket) {
//     socket.on('disconnect', disconnect.bind(null, socket));
//     socket.on('move', move.bind(null, socket));
//     socket.on('stop', stop.bind(null, socket));
// }

function disconnect(socket) {
    console.info(`Client disconected [id=${socket.id}]`);
    socket.disconnect();
    pool.delete(socket.id);
}

function move(socket) {
    console.log('Server move');

    for(const [id, sock] of pool) {
        if (id !== socket.id) {
            sock.emit('move');
        }
    }
}

function stop(socket) {
    console.log('Server stop')
    for(const [id, sock] of pool) {
        if (id !== socket.id) {
            sock.emit('stop');
        }
    }
}


httpServer.listen(PORT, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log(`Server is running on port: ${PORT}`);
});