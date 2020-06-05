// @ts-check
import SpriteSheet from './SpriteSheet.js';
import { loadImage, loadLevel } from './loaders.js';

function drawBackground(background, context, sprites) {
    const { ranges, tile } = background;
    ranges.forEach(([x1, x2, y1, y2]) => {
        for (let x = x1; x < x2; x += 1) {
            for (let y = y1; y < y2; y += 1) {
                sprites.drawTile(tile, context, x, y);
            }
        }
    });
}

const canvas = document.getElementById('screen');
/** @type {CanvasRenderingContext2D} */
// @ts-ignore
const context = canvas.getContext('2d');

loadImage('/img/tiles.png')
    .then((image) => {
        const sprites = new SpriteSheet(image, 16, 16);
        sprites.define('sky', 3, 23);
        sprites.define('ground', 0, 0);

        loadLevel('1-1')
            .then((level) => {
                level.backgrounds.forEach((background) => {
                    drawBackground(background, context, sprites);
                });
            });
    });