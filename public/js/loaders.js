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

export function loadLevel(name) {
    return Promise.all([
            fetch(`/levels/${name}.json`)
                .then((res) => res.json()),
                loadBackgroundSprites(),
        ])
        .then(([levelSpecification, backgroundSprites]) => {
            const level = new Level();

            const backgroundLayer = createBackgroundLayer(levelSpecification.backgrounds, backgroundSprites);
            level.compositor.layers.push(backgroundLayer);
    
            const spriteLayer = createSpriteLayer(level.entities);
            level.compositor.layers.push(spriteLayer);

            return level;
        });
}