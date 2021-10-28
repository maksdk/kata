import { Vector } from '@core/game/math/Vector';

interface IMotionProps {
    velocity?: Vector;
    rotation?: number;
    speed?: number;
}

export class Motion {
    public readonly speed;

    public constructor(props: IMotionProps = {}) {
        const { speed = 2 } = props;
        this.speed = speed;
    }
}