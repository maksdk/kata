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
    (function() {
        const oldEmit = socket.emit;
        socket.emit = function() {
            const args = Array.from(arguments);
            setTimeout(() => {
                console.log('Timeout')
                oldEmit.apply(this, args);
            }, 200);
        };
    })();  

    pool.set(socket.id, socket);

    socket.on('disconnect', disconnect.bind(null, socket));
    socket.on('move', move.bind(null, socket));
    socket.on('stop', stop.bind(null, socket));

    if (pool.size === 2) {
        start();
    }
});

function disconnect(socket) {
    console.info(`Client disconected [id=${socket.id}]`);
    socket.disconnect();
    pool.delete(socket.id);
}

function start() {
    let trackNumber = 0;
    for(const [id, sock] of pool) {
        trackNumber += 1;
        sock.emit('start', trackNumber);
    }
}

function move(socket, trackNumber) {
    for(const [id, sock] of pool) {
        if (id !== socket.id) {
            sock.emit('move', trackNumber);
        }
    }
}

function stop(socket, trackNumber) {
    for(const [id, sock] of pool) {
        if (id !== socket.id) {
            sock.emit('stop', trackNumber);
        }
    }
}


httpServer.listen(PORT, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log(`Server is running on port: ${PORT}`);
});