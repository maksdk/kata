// @ts-check
import Timer from './Timer.js';
import Keyboard from './KeyboardState.js';
import { createMario } from './entities.js';
import { loadLevel } from './loaders.js';

const canvas = document.getElementById('screen');
/** @type {CanvasRenderingContext2D} */
// @ts-ignore
const context = canvas.getContext('2d');

Promise.all([ 
    createMario(), 
    loadLevel('1-1')
])
    .then(([mario, level]) => {

        level.entities.add(mario);
        
        const SPACE = 32;
        const input = new Keyboard();
        input.listenTo(window);
        input.addMapping(SPACE, (keyState) => {
            if (keyState) {
                mario.jump.start();
            } else {
                mario.jump.cancel();
            }
        });

        const gravity = 2000;
        mario.pos.set(64, 64);

        const timer = new Timer(1/ 60);
        timer.update = function update(deltaTime) {
            level.compositor.draw(context);
            level.update(deltaTime);

            mario.vel.y += gravity * deltaTime;
        }

        timer.start();
    });