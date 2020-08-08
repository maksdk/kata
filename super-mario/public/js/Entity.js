// @ts-check

import { Vec2 } from './math.js';

export const  Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom')
};

export default class Entity {
    constructor() {
        this.pos = new Vec2(0, 0);
        this.vel = new Vec2(0, 0);
        this.size = new Vec2(0, 0);

        this.traits = [];
    }

    addTrait(trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    obstruct(side) {
        // console.log(side);

        this.traits.forEach((trait) => {
            trait.obstruct(this, side);
        });
    }

    update(deltaTime) {
        this.traits.forEach((trait) => {
            trait.update(this, deltaTime);
        });
    }

    draw() {}
}