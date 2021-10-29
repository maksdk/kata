import { IPhysicsPrimitiveConfig, Physics, Primitive as Body } from '@core/game/math/Physics';
import { Vector } from '@core/game/math/Vector';

export enum RigidBodyType {
    Static = 'Static',
    Dynamic = 'Dynamic',
}

export enum PrimitiveType {
    Rect = 'Rect',
    Circle = 'Circle',
    Polygon = 'Polygon',
}

export interface IRigidBodyOptions extends IPhysicsPrimitiveConfig {
    rigidbodyType: RigidBodyType;
    width?: number;
    height?: number;
    radius?: number;
    vertices?: Vector[];
    isTrigger?: boolean;
}

const defaultOptions: IRigidBodyOptions = {
    primitiveType: PrimitiveType.Rect,
    rigidbodyType: RigidBodyType.Static,
    width: 0,
    height: 0,
    radius: 0,
    vertices: [] as Vector[],
    isTrigger: false,
    friction: 0.1,
};

export class RigidBody {
    private _body: Body | null = null;
    private options: IRigidBodyOptions = defaultOptions;

    public constructor(private physics: Physics, options: IRigidBodyOptions) {
        this.options = {
            ...defaultOptions,
            ...options || {},
        };

        this.createBody();
    }

    public get width(): number {
        return this.options.width;
    }

    public get height(): number {
        return this.options.height;
    }

    public get radius(): number {
        return this.options.radius;
    }

    public get vertices(): Vector[] {
        return this.options.vertices;
    }

    public get isTrigger(): boolean {
        return this.options.isTrigger;
    }

    public get isStatic(): boolean {
        return this.rigidbodyType === RigidBodyType.Static;
    }

    public get isDynamic(): boolean {
        return this.rigidbodyType === RigidBodyType.Dynamic;
    }

    public get rigidbodyType(): RigidBodyType {
        return this.options.rigidbodyType;
    }

    public get primitiveType(): PrimitiveType {
        return this.options.primitiveType;
    }

    public get body(): Body | null {
        return this._body;
    }

    public set velocity(v: Vector) {
        if (this.body) {
            this.body.setVelocity(v.x, v.y);
        }
    }

    public set angularVelocity(v: number) {
        if (this.body) {
            this.body.setAngularVelocity(v);
        }
    }

    public set angle(angle: number) {
        if (this.body) {
            this.body.setAngle(angle);
        }
    }

    public remove(): void {
        if (this._body) {
            this.physics.removeChild(this._body);
            this._body = null;
        }
    }

    private createBody(): void {
        if (this.body) {
            this.physics.removeChild(this.body);
        }

        this.checkPrimitives();

        const { rigidbodyType, isTrigger, ...rest } = this.options;

        this._body = this.physics.addChild({
            ...rest,
            isStatic: rigidbodyType === RigidBodyType.Static,
            isSensor: isTrigger,
        });

        // TODO: Work only such way
        if (this.options.velocity) {
            this.body.setVelocity(this.options.velocity.x, this.options.velocity.y);
        }
    }

    private checkPrimitives(): void | never {
        switch(this.primitiveType) {
            case PrimitiveType.Rect:
                if (this.width <= 0) {
                    console.error(`RigidBodyComponent. Rect has invalid width: "${this.width}"`);
                }
                if (this.height <= 0) {
                    console.error(`RigidBodyComponent. Rect has invalid height: "${this.height}"`);
                }
                break;
            case PrimitiveType.Circle:
                if (!this.radius) {
                    console.error(`RigidBodyComponent. Circle has invalid radius: "${this.radius}"`);
                }
                break;
            case PrimitiveType.Polygon:
                if (!this.vertices.length) {
                    console.error(`RigidBodyComponent. Polygon does not have vertices: "${this.vertices.toString()}"`);
                }
                break;
            default:
                throw new Error(`RigidBodyComponent. Primitive type: "${this.primitiveType as string}" is not valid`);
        }
    }
}
