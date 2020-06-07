// @ts-check
import Timer from './Timer.js';
import Camera from './Camera.js';
import { setupMouseControl } from './debug.js';
import { setupKeyboard } from './input.js';
import { createMario } from './entities.js';
import { loadLevel } from './loaders.js';
import { createCollisionLayer, createCameraLayer } from './layers.js';

const canvas = document.getElementById('screen');
/** @type {CanvasRenderingContext2D} */
// @ts-ignore
const context = canvas.getContext('2d');

Promise.all([ 
    createMario(), 
    loadLevel('1-1')
])
    .then(([mario, level]) => {
        const camera = new Camera();

        level.entities.add(mario);
        
        const input = setupKeyboard(mario);
        input.listenTo(window);

        level.compositor.layers.push(
            createCollisionLayer(level),
            createCameraLayer(camera)
        );
        
        //debug
        setupMouseControl(canvas, mario, camera);

        const timer = new Timer(1/ 60);
        timer.update = function update(deltaTime) {
            level.compositor.draw(context, camera);
            level.update(deltaTime);
        }

        timer.start();
    });