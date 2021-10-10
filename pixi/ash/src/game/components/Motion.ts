import { Vector } from '@core/game/math/Vector';

interface IMotionProps {
    velocity?: Vector;
    rotation?: number;
    moveSpeed?: number;
}

export class Motion {
    public velocity: Vector;
    public rotation = 0;
    public readonly moveSpeed;

    public constructor(props: IMotionProps = {}) {
        const { velocity = new Vector(0, 0), rotation = 0, moveSpeed = 100 } = props;
        this.velocity = velocity;
        this.rotation = rotation;
        this.moveSpeed = moveSpeed;
    }
}