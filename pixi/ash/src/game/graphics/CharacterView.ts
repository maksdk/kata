import { Graphics } from 'pixi.js';

export class CharacterView extends Graphics {
    public constructor() {
        super();
        this.moveTo(20, 0)
            .beginFill(0xffffff)
            .lineTo(-14, 14)
            .lineTo(-8, 0)
            .lineTo(-14, -14)
            .lineTo(20, 0)
            .endFill();
    }
}