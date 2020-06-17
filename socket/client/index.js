//@ts-check
import { Application, Ticker } from "pixi.js";
import io from 'socket.io-client';
import config from '../config.json';
import { MainStage } from "./MainStage";

const app = new Application({
    width: 600, 
    height: 600, 
    backgroundColor: 0x000000
});

const stage = new MainStage();

app.ticker.add(() => {
    const delta = Ticker.shared.elapsedMS;
    stage.tick(delta);
});

app.stage.addChild(stage);

document.body.appendChild(app.view);

const serverUrl = `${config.protocol}://${config.hostname}:${config.port}`
const socket = io(serverUrl);
socket.on('connect', () => {
    console.log('Connected!');
});

socket.on('move', () => {
    console.log('Client move')
    stage.moveEntity('remotePlayer');
});

socket.on('stop', () => {
    console.log('Client stop')
    stage.stopEntity('remotePlayer');
});

stage.on('movePlayer', () => socket.emit('move'));
stage.on('stopPlayer', () => socket.emit('stop'));
