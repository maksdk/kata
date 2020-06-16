//@ts-check
import * as PIXI from "pixi.js";
import io from 'socket.io-client';
import config from '../config.json';

const serverUrl = `${config.protocol}://${config.hostname}:${config.port}`
const socket = io(serverUrl);
socket.on('connect', () => {
    console.log('Конектед сука!!!');
});


const app = new PIXI.Application({
    width: 600, 
    height: 600, 
    backgroundColor: 0xFF0000 
});
document.body.appendChild(app.view);
