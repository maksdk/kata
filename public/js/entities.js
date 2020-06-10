// @ts-check
import Entity from './Entity.js';
import Jump from './traits/Go.js';
import Go from './traits/Jump.js';
import { loadSpriteSheet } from './loaders.js';
import { createAnim } from './anim.js';


const FAST_DRAG = 1 / 5000;
const SLOW_DRAG = 1 / 1000;


export function createMario() {
    return loadSpriteSheet('mario')
        .then((sprite) => {
            const mario = new Entity();
            mario.size.set(14, 16);

            mario.addTrait(new Jump());
            mario.addTrait(new Go());
            mario.go.dragFactor = SLOW_DRAG;

            mario.turbo = function(turboOn) {
                this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
            }

            const runAnim = createAnim(['run-1', 'run-2', 'run-3'], 8);

            function routeFrame(mario) {
                if (mario.jump.falling) {
                    return 'jump';
                }
    
                if (mario.go.distance > 0) {
                    if ((mario.vel.x > 0 && mario.go.direction < 0) || (mario.vel.x < 0 && mario.go.direction > 0)) {
                        return 'break';
                    }
                    return runAnim(mario.go.distance);
                }
                return 'idle';
            }

            mario.draw = function drawMario(context) {
                const frame = routeFrame(this);
                // @ts-ignore
                sprite.draw(frame, context, 0, 0, this.go.heading < 0);
            }

            return mario;
        });
}