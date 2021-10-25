import { BaseView } from '@core/game/graphics/BaseView';
import { Vector } from '@core/game/math/Vector';
import { Graphics } from 'pixi.js';

interface IWallViewProps {
    width: number;
    height: number;
    origin?: Vector;
}

export class WallView extends BaseView {
    public constructor(props: IWallViewProps) {
        super();

        const { width, height, origin = new Vector(0.5, 0.5) } = props;

        this.addChild(new Graphics())
            .beginFill(0x0000FF)
            .drawRect(-width * origin.x, -height * origin.y, width, height)
            .endFill();
    }
}