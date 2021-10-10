import { Vector } from '@core/game/math/Vector';
import { Graphics } from 'pixi.js';


interface IWallViewProps {
    width: number;
    height: number;
    origin?: Vector;
}

export class WallView extends Graphics {
    public constructor(props: IWallViewProps) {
        super();

        const { width, height, origin = new Vector(0.5, 0.5) } = props;

        const x = origin.x * -width;
        const y = origin.y * -height;

        this.lineStyle(2, 0xFFFF00)
            .drawRect(x, y, width, height)
            .endFill();
    }
}