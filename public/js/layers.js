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

export function createBackgroundLayer(backgrounds, sprites) {
    const buffer = document.createElement('canvas');
    buffer.width = 256;
    buffer.height = 240;

    const context = buffer.getContext('2d');

    backgrounds.forEach((background) => {
        drawBackground(background, context, sprites);
    });

    return function drawBackgroundLayer(context) {
        context.drawImage(buffer, 0, 0);
    }
}

export function createSpriteLayer(entity) {
    return function drawSpriteLayer(context) {
        entity.draw(context);
    }
}