import { BaseView } from '@core/game/graphics/BaseView';
import { Graphics } from 'pixi.js';

export class BulletView extends BaseView {
    public constructor(props: { radius: number; color?: number }) {
        super();

        this.addChild(new Graphics())
        .beginFill(props.color || 0xff0000)
        .drawCircle(0, 0, props.radius)
        .endFill();
    }
}