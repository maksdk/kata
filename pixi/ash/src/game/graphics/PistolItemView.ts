import { BaseView } from '@core/game/graphics/BaseView';
import { Vector } from '@core/game/math/Vector';
import { Graphics } from 'pixi.js';

interface IPistolViewProps {
    width: number;
    height: number;
    origin?: Vector;
}

export class PistolView extends BaseView {
    public constructor(props: IPistolViewProps) {
        super();

        const { width, height, origin = new Vector(0.5, 0.5) } = props;

        const x = origin.x * -width;
        const y = origin.y * -height;

        this.addChild(new Graphics())
            .beginFill(0xFF00FF)
            .drawRect(x, y, width, height)
            .endFill();
    }
}