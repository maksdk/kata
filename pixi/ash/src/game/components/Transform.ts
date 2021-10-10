interface ITransformProps {
    x?: number;
    y?: number;
    sx?: number;
    sy?: number;
    rotation?: number;
}

export class Transform {
    public x = 0;
    public y = 0;
    public sx = 1;
    public sy = 1;
    public rotation = 0;

    public constructor(props: ITransformProps = {}) {
        const { x = 0, y = 0, sx = 1, sy = 1, rotation = 0 } = props;
        this.x = x;
        this.y = y;
        this.sx = sx;
        this.sy = sy;
        this.rotation = rotation;
    }
}