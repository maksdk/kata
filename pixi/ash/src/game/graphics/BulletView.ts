import { Graphics } from 'pixi.js';

export class BulletView extends Graphics {
    public constructor(props: { radius: number; color?: number }) {
        super();

        this.beginFill(props.color || 0xff0000).drawCircle(0, 0, props.radius).endFill();
    }
}