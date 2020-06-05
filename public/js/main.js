// @ts-check
import Compositor from './Compositor.js';
import { loadLevel } from './loaders.js';
import { loadMarioSprite, loadBackgroundSprites } from './sprites.js';
import { createSpriteLayer, createBackgroundLayer } from './layers.js';

const canvas = document.getElementById('screen');
/** @type {CanvasRenderingContext2D} */
// @ts-ignore
const context = canvas.getContext('2d');

Promise.all([loadMarioSprite(), loadBackgroundSprites(), loadLevel('1-1')])
    .then(([marioSprite, backgroundSprites, level]) => {
        const comp = new Compositor();

        const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
        comp.layers.push(backgroundLayer);

        const pos = {
            x: 64,
            y: 64
        };
        const marioLayer = createSpriteLayer(marioSprite, pos);
        comp.layers.push(marioLayer);

        function update() {
            comp.draw(context);
            pos.x += 2;
            pos.y += 2;
            requestAnimationFrame(update);
        }

        update();

    });