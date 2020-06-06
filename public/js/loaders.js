// @ts-check
import Level from './Level.js';
import { createSpriteLayer, createBackgroundLayer } from './layers.js';
import { loadBackgroundSprites } from './sprites.js';

export function loadImage(url) {
    return new Promise((resolve) => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

function createTiles(level, backgrounds) {
    backgrounds.forEach((background) => {
        background.ranges.forEach(([x1, x2, y1, y2]) => {
            for (let x = x1; x < x2; x += 1) {
                for (let y = y1; y < y2; y += 1) {
                    level.tiles.set(x, y, {
                        name: background.tile
                    })
                    // sprites.drawTile(tile, context, x, y);
                }
            }
        });
    });
}

export function loadLevel(name) {
    return Promise.all([
            fetch(`/levels/${name}.json`)
                .then((res) => res.json()),
                loadBackgroundSprites(),
        ])
        .then(([levelSpecification, backgroundSprites]) => {
            const level = new Level();

            createTiles(level, levelSpecification.backgrounds);

            const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
            level.compositor.layers.push(backgroundLayer);
    
            const spriteLayer = createSpriteLayer(level.entities);
            level.compositor.layers.push(spriteLayer);

            return level;
        });
}