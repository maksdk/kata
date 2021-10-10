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

    public constructor(private props: ITransformProps = { x: 0, y: 0, sx: 1, sy: 1, rotation: 0 }) {
        this.x = this.props.x;
        this.y = this.props.y;
        this.sx = this.props.sx;
        this.sy = this.props.sy;
        this.rotation = this.props.rotation;
    }
}