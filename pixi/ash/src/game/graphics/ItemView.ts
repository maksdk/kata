import { BaseView } from '@core/game/graphics/BaseView';
import { Graphics } from 'pixi.js';

export class ItemView extends BaseView {
    public constructor() {
        super();

        const width = 50;
        const height = 50;

        this.addChild(new Graphics())
            .beginFill(0xFFFF00)
            .drawRect(-width * 0.5, -height * 0.5, width, height)
            .endFill();
    }
}