import { Vector } from '@core/game/math/Vector';
import { Graphics } from 'pixi.js';

interface IShotgunViewProps {
    width: number;
    height: number;
    origin?: Vector;
}

export class ShotgunView extends Graphics {
    public constructor(props: IShotgunViewProps) {
        super();

        const { width, height, origin = new Vector(0.5, 0.5) } = props;

        const x = origin.x * -width;
        const y = origin.y * -height;

        this.beginFill(0xFFFFFF)
            .drawRect(x, y, width, height)
            .endFill();
    }
}