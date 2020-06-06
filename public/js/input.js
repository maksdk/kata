// @ts-check
import Keyboard from './KeyboardState.js';

export function setupKeyboard(entity) {
    const SPACE = 'Space';
    const RIGHT = 'ArrowRight';
    const LEFT = 'ArrowLeft';
        
    const input = new Keyboard();
    input.addMapping(SPACE, (keyState) => {
        if (keyState) {
            entity.jump.start();
        } else {
            entity.jump.cancel();
        }
    });

    input.addMapping(RIGHT, (keyState) => {
        entity.go.direction = keyState;
    });
    
    input.addMapping(LEFT, (keyState) => {
        entity.go.direction = -keyState;
    });

    return input;
}