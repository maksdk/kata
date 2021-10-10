import { Graphics } from 'pixi.js';

export class BulletView extends Graphics {
    public constructor() {
        super();

        this.beginFill(0xff0000).drawCircle(0, 0, 5).endFill();
    }
}