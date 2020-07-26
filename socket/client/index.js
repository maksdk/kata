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




document.body.appendChild(app.view);

const serverUrl = `${config.protocol}://${config.hostname}:${config.port}`
const socket = io(serverUrl);
socket.on('connect', () => {
    console.log('Connected!');
});

const stage = new MainStage();
socket.on('start', (trackNumber) => {
    console.log('Client start')
    
    app.stage.addChild(stage);
    stage.start({ trackNumber });

    app.ticker.add(() => {
        const delta = Ticker.shared.elapsedMS;
        
        stage.tick(delta);
    });
});

socket.on('move', (trackNumber) => {
    console.log('Client move')
    stage.moveEntity(trackNumber);
});

socket.on('stop', (trackNumber) => {
    console.log('Client stop')
    stage.stopEntity(trackNumber);
});

stage.on('movePlayer', (trackNumber) => socket.emit('move', trackNumber));
stage.on('stopPlayer', (trackNumber) => socket.emit('stop', trackNumber));
