//@ts-check
import io from 'socket.io-client';
import config from '../config.json';

const serverUrl = `${config.protocol}://${config.hostname}:${config.port}`
const socket = io(serverUrl);
socket.on('connect', () => {
    console.log('Конектед сука!!!');
});