import { Vector } from '@core/game/math/Vector';

export enum CollisionShapeType {
    Rect = 'Rect',
    Circle = 'Circle',
}

interface ICollsionProps {
    width?: number;
    height?: number;
    position: Vector;
    type: CollisionShapeType;
    origin?: Vector; 
    radius?: number;
}

export class Collision {
    public readonly polygon: Vector[];
    public readonly type: CollisionShapeType;
    public readonly radius: number;
    public readonly width: number;
    public readonly height: number;
    public readonly origin: Vector;

    public constructor(props: ICollsionProps) {
        const { width = 0, height = 0, radius = 0, type, origin = new Vector(0.5, 0.5) } = props;

        this.type = type;
        this.radius = radius;
        this.width = width;
        this.height = height;
        this.origin = origin;

        switch (type) {
            case CollisionShapeType.Rect:
                if (width <= 0 || height <= 0) {
                    throw new Error('Width and height must be more 0px');
                }
                this.polygon = this.generateRectPolygon(width, height, origin);
                break;
            case CollisionShapeType.Circle:
                if (radius <= 0) {
                    throw new Error('Radius must be more 0px');
                }
                break;
            default:
                throw new Error(`Wrong collision shape type: "${type as string}".`);
        }
    }

    private generateRectPolygon(w: number, h: number, origin: Vector): Vector[] {
        const pos = new Vector().sub(new Vector(w * origin.x, h * origin.y));
        const p1 = pos.clone();
        const p2 = pos.add(new Vector(w, 0));
        const p3 = pos.add(new Vector(w, h));
        const p4 = pos.add(new Vector(0, h));
        return [p1, p2, p3, p4];
    }
}