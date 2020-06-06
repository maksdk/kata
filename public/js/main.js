// @ts-check
import Timer from './Timer.js';
import { setupKeyboard } from './input.js';
import { createMario } from './entities.js';
import { loadLevel } from './loaders.js';
import { createCollisionLayer } from './layers.js';

const canvas = document.getElementById('screen');
/** @type {CanvasRenderingContext2D} */
// @ts-ignore
const context = canvas.getContext('2d');

Promise.all([ 
    createMario(), 
    loadLevel('1-1')
])
    .then(([mario, level]) => {
        // mario.pos.set(0, 0);
        level.entities.add(mario);
        
        const input = setupKeyboard(mario);
        input.listenTo(window);
    
        // debug
        // level.compositor.layers.push(createCollisionLayer(level));
        // ['mousedown', 'mousemove'].forEach((eventName) => {
        //     canvas.addEventListener(eventName, (event) => {
        //         if (event.buttons === 1) {
        //             mario.vel.set(0, 0);
        //             mario.pos.set(event.offsetX, event.offsetY);
        //         }
        //     });
        // });
        //

        const timer = new Timer(1/ 60);
        timer.update = function update(deltaTime) {
            level.compositor.draw(context);
            level.update(deltaTime);
        }

        timer.start();
    });