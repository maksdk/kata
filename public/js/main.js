// @ts-check
import Compositor from './Compositor.js';
import Timer from './Timer.js';
import Keyboard from './KeyboardState.js';
import { createMario } from './entities.js';
import { loadLevel } from './loaders.js';
import { loadBackgroundSprites } from './sprites.js';
import { createSpriteLayer, createBackgroundLayer } from './layers.js';

const canvas = document.getElementById('screen');
/** @type {CanvasRenderingContext2D} */
// @ts-ignore
const context = canvas.getContext('2d');

Promise.all([createMario(), loadBackgroundSprites(), loadLevel('1-1')])
    .then(([mario, backgroundSprites, level]) => {
        

        const comp = new Compositor();

        const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
        comp.layers.push(backgroundLayer);

        const SPACE = 32;
        const input = new Keyboard();
        input.listenTo(window);
        input.addMapping(SPACE, (keyState) => {
            console.log(keyState);
            if (keyState) {
                mario.jump.start();
            } else {
                mario.jump.cancel();
            }
        });

        const gravity = 2000;
        mario.pos.set(64, 180);

        const spriteLayer = createSpriteLayer(mario);
        comp.layers.push(spriteLayer);

        const timer = new Timer(1/ 60);
        timer.update = function update(deltaTime) {
            comp.draw(context);
            mario.update(deltaTime);
            mario.vel.y += gravity * deltaTime;
        }

        timer.start();
    });