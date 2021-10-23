import { PrimitiveType } from '@core/game/constants';
import { Vector } from '@core/game/math/Vector';

export enum RigidBodyType {
    Static = 'Static',
    Dynamic = 'Dynamic',
}

export interface ICollsionProps {
    type: PrimitiveType;
    width?: number;
    height?: number;
    radius?: number;
    vertices?: Vector[];
    isTrigger?: boolean;
    rigigBodyType?: RigidBodyType
}

export class Collision {
    public readonly vertices: Vector[];
    public readonly type: PrimitiveType;
    public readonly radius: number;
    public readonly width: number;
    public readonly height: number;
    public readonly isTrigger: boolean;
    public readonly rigigBodyType: RigidBodyType;
    private readonly origin: Vector = new Vector(0.5, 0.5);

    public constructor(props: ICollsionProps) {
        const { width = 0, height = 0, radius = 0, vertices = [], isTrigger = false, rigigBodyType = RigidBodyType.Static, type } = props;

        this.type = type;
        this.radius = radius;
        this.width = width;
        this.height = height;
        this.vertices = vertices;
        this.isTrigger = isTrigger;
        this.rigigBodyType = rigigBodyType;

        switch (type) {
            case PrimitiveType.Rect:
                if (width <= 0 || height <= 0) {
                    throw new Error('Width and height must be more 0px');
                }
                this.vertices = this.generateRectVertices(width, height, this.origin);
                break;
            case PrimitiveType.Circle:
                if (radius <= 0) {
                    throw new Error('Radius must be more 0px');
                }
                break;

            case PrimitiveType.Polygon:
                if (vertices.length === 0) {
                    throw new Error('Vertices can\'t be empty');
                }
                break;
            default:
                throw new Error(`Wrong collision shape type: "${type as string}".`);
        }
    }

    protected generateRectVertices(w: number, h: number, origin: Vector): Vector[] {
        const pos = new Vector().sub(new Vector(w * origin.x, h * origin.y));
        const p1 = pos.clone();
        const p2 = pos.add(new Vector(w, 0));
        const p3 = pos.add(new Vector(w, h));
        const p4 = pos.add(new Vector(0, h));
        return [p1, p2, p3, p4];
    }
}