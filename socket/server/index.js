const path = require('path');
const Express = require('express');
const config = require('../config.json');
const expressApp = Express();
const httpServer = require('http').createServer(expressApp);
const socketIo = require('socket.io')(httpServer);

const PORT = config.port;

expressApp.use(Express.static(path.join(__dirname, '../dist/client')));

socketIo.on('connection', (socket) => {
    console.info(`Client connected [id=${socket.id}]`);

    socket.on('disconnect', () => {
        console.info(`Client gone [id=${socket.id}]`);
    });
});

httpServer.listen(PORT, (err) => {
    if (err) {
        throw new Error(err);
    }
    console.log(`Server is running on port: ${PORT}`);
});