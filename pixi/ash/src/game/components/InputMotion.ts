import { Vector } from '@core/game/math/Vector';

interface IInputMotionProps {
    velocity?: Vector;
    rotation?: number;
    speed?: number;
}

export class InputMotion {
    public readonly speed;

    public constructor(props: IInputMotionProps = {}) {
        const { speed = 2 } = props;
        this.speed = speed;
    }
}