import { BaseView } from '@core/game/graphics/BaseView';
import { Graphics } from 'pixi.js';

export class EnemyView extends BaseView {
    public constructor(options: { width: number; height: number; }) {
        super();

        this.addChild(new Graphics())
            .beginFill(0xFFFFFF)
            .drawRect(-options.width * 0.5, -options.height * 0.5, options.width, options.height)
            .endFill();
    }
}