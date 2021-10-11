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

        this.beginFill(0x0000FF)
            .drawRect(x, y, width, height)
            .endFill();
    }
}