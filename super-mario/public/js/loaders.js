// @ts-check
import SpriteSheet from './SpriteSheet.js';
import Level from './Level.js';
import { createSpriteLayer, createBackgroundLayer } from './layers.js';
import { createAnim } from './anim.js';

export function loadImage(url) {
    return new Promise((resolve) => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

function loadJSON(url) {
    return fetch(url)
    .then((res) => res.json());
}

export function loadSpriteSheet(name) {
    return loadJSON(`/sprites/${name}.json`)
        .then((sheetSpec) => {
            return Promise.all([
                sheetSpec,
                loadImage(sheetSpec.imageURL)
            ]);
        })
        .then(([sheetSpec, image]) => {
            const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);

            if (sheetSpec.tiles) {
                sheetSpec.tiles.forEach((tileSpec) => {
                    const { name, index } = tileSpec;
                    sprites.defineTile(name, index[0], index[1]);
                });
            }

            if (sheetSpec.frames) {
                sheetSpec.frames.forEach((frameSpec) => {
                    const [x, y, width, height] = frameSpec.rect;
                    sprites.define(frameSpec.name, x, y, width, height);
                });
            }

            if (sheetSpec.animations) {
                sheetSpec.animations.forEach((animSpec) => {
                    const animation = createAnim(animSpec.frames, animSpec.frameLength);
                    sprites.defineAnim(animSpec.name, animation);
                });
            }

            return sprites;
        });
}

export function loadLevel(name) {
    return loadJSON(`/levels/${name}.json`)
        .then((levelSpec) => Promise.all([
            levelSpec,
            loadSpriteSheet(levelSpec.spriteSheet),
        ]))
        .then(([levelSpecification, backgroundSprites]) => {
            const level = new Level();

            createTiles(level, levelSpecification.backgrounds, levelSpecification.patterns);

            const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
            level.compositor.layers.push(backgroundLayer);
    
            const spriteLayer = createSpriteLayer(level.entities);
            level.compositor.layers.push(spriteLayer);

            return level;
        });
}

function createTiles(level, backgrounds, patterns, offsetX = 0, offsetY = 0) {
    function applyRange(background, xStart, xLength, yStart, yLength) {
        const xEnd = xStart + xLength;
        const yEnd = yStart + yLength;

        for (let x = xStart; x < xEnd; x += 1) {
            for (let y = yStart; y < yEnd; y += 1) {
                const derivedX = x + offsetX;
                const derivedY = y + offsetY;

                if (background.pattern) {
                    const { backgrounds } = patterns[background.pattern];
                    createTiles(level, backgrounds, patterns, derivedX, derivedY);
                } else {
                    level.tiles.set(derivedX, derivedY, {
                        name: background.tile,
                        type: background.type
                    });
                }
            }
        }
    }

    backgrounds.forEach((background) => {
        background.ranges.forEach((range) => {
            if (range.length === 4) {
                const [xStart, xLength, yStart, yLength] = range;
                applyRange(background, xStart, xLength, yStart, yLength);
            } else if (range.length === 3) {
                const [xStart, xLength, yStart] = range;
                applyRange(background, xStart, xLength, yStart, 1);
            } else if (range.length === 2) {
                const [xStart, yStart] = range;
                applyRange(background, xStart, 1, yStart, 1);
            }
        });
    });
}