import decomp from 'poly-decomp';
import { Vector } from '@core/game/math/Vector';
import { Engine, Render, Runner, World, Body, Bodies, Vertices, Common, Vector as MatterVector, Events } from 'matter-js';
import { PrimitiveType } from '@core/game/components/RigidBody';
import { utils } from 'pixi.js';

export interface IPhysicsPrimitiveProps {
    primitiveType: PrimitiveType;
    position?: { x: number; y: number };
    width?: number;
    height?: number;
    radius?: number;
    vertices?: Vector[];
    isStatic?: boolean;
    isSensor?: boolean;
}

export interface IPhysicsConfig {
    width: number;
    height: number;
    worldPosition: Vector;
    isDebug?: boolean
}

export interface IPhysicsCollisionPair {
    bodyA: Primitive; 
    bodyB: Primitive;
}


export interface IPhysicsStartCollisionEvent {
    pairs: IPhysicsCollisionPair[];
}

export class Physics extends utils.EventEmitter {
    private readonly config: IPhysicsConfig;
    private render: Render | null = null;
    private readonly engine: Engine;
    private readonly runner: Runner;
    private isRun = false;
    private primitives: Map<number, Primitive> = new Map();

    public constructor(config: IPhysicsConfig) {
        super();

        this.config = {
            isDebug: false,
            ...config
        };

        this.engine = Engine.create();
        this.engine.gravity.y = 0;

        this.runner = Runner.create();

        if (this.config.isDebug) {
            this.render = this.createRender();
        }

        Common.setDecomp(decomp);

        Events.on(this.engine, 'collisionStart', (event) => this.onStartCollision(event));
    }

    public run(): void {
        this.isRun = true;

        if (this.render) {
            // Add scene border
            // this.addChild({
            //     type: PrimitiveType.Rect,
            //     width: this.config.width,
            //     height: this.config.height,
            //     position: new Vector(),
            //     isStatic: true,
            //     isSensor: true,
            // });
        }
    }

    public addChild(props: IPhysicsPrimitiveProps): Primitive | null {
        if (!this.isRun) {
            console.error('Physics is not ran');
            return null;
        }

        const {
            primitiveType,
            width = 0,
            height = 0,
            radius = 0,
            position = { x: 0, y: 0 },
            vertices = [],
            ...rest
        } = props;

        const config = {
            isStatic: false,
            isSensor: false,
            ...rest,
        };

        // Adapt position
        const x = position.x + this.config.worldPosition.x;
        const y = position.y + this.config.worldPosition.y;

        let body = null;

        if (primitiveType === PrimitiveType.Rect) {
            const rect = Bodies.rectangle(x, y, width, height, config);
            World.add(this.engine.world, rect);
            body = new Primitive(rect, this.config.worldPosition);
        } else if (primitiveType === PrimitiveType.Circle) {
            const circle = Bodies.circle(x, y, radius, config);
            World.add(this.engine.world, circle);
            body = new Primitive(circle, this.config.worldPosition);
        } else if (primitiveType === PrimitiveType.Polygon) {
            if (vertices.length > 0) {
                const polygon = Bodies.fromVertices(x, y, vertices, config);
                World.add(this.engine.world, polygon);
                body = new Primitive(polygon, this.config.worldPosition);
            } else {
                console.error('Physics- addChild. Error: polygon is empty');
            }
        } else {
            console.error(`Physics. Such type of primitive: "${primitiveType as string}" is not found`);
        }


        if (body) {
            this.primitives.set(body.id, body);
        }

        return body;
    }

    public removeChild(child: Primitive): void {
        World.remove(this.engine.world, child.body);

        if (this.primitives.has(child.id)) {
            this.primitives.delete(child.id);
        } else {
            console.error('Physics - removeChild. Error: child is not found in primitive list: ', child);
        }
    }

    public update(dt: number): void {
        Runner.tick(this.runner, this.engine, dt);
        Render.world(this.render);
    }

    private createRender(): Render {
        const canvas = this.createCanvas(this.config.width, this.config.height);

        const render = Render.create({
            canvas: canvas,
            engine: this.engine,
            options: {
                background: '#00000000',
                wireframeBackground: '#00000000',
                width: this.config.width,
                height: this.config.height,
                // @ts-ignore
                showCollisions: true
            }
        });

        return render;
    }

    private createCanvas(w: number, h: number): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.style.position = 'absolute';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);

        return canvas;
    }

    //TODO:  ADD types
    private onStartCollision(event: any): void {
        
        const initReduce: IPhysicsCollisionPair[] = [];
        const pairs: IPhysicsCollisionPair[] = event.pairs.reduce((acc, pair) => {
            const { bodyA, bodyB } = pair;
            const b1 = this.primitives.get(bodyA.id);
            const b2 = this.primitives.get(bodyB.id);

            console.log('pair: ', pair)

            if (!b1 || !b2) {
                console.error('Physics - onStartCollision. Error: bodies are not found in primitives list', event);
                return acc;
            }

            return [...acc, { bodyA: b1, bodyB: b2 }];
        }, initReduce);
        console.log('Start collision', pairs);
        this.emit('collisionstart', { pairs });
    }
}

export class Primitive {
    public constructor(public body: Body, private offset: { x: number; y: number }) {

    }

    public get position(): { x: number; y: number; } {
        return {
            x: this.body.position.x - this.offset.x,
            y: this.body.position.y - this.offset.y,
        };
    }

    public get rotation(): number {
        return this.body.angle;
    }

    public get id(): number {
        return this.body.id;
    }

    public setPosition(x: number, y: number): void {
        Body.setPosition(this.body, MatterVector.create(x + this.offset.x, y + this.offset.y));
    }

    public setAngle(angle: number): void {
        Body.setAngle(this.body, angle);
    }

    public setVelocity(x: number, y: number): void {
        Body.setVelocity(this.body, MatterVector.create(x, y));
    }

    public setAngularVelocity(angle: number): void {
        Body.setAngularVelocity(this.body, angle);
    }
}

// TODO: Temporary decision
export function createVerticesByPoints(points: Vector[]): Vector[] {
    const vertCenter = Vertices.centre(points);
    const res = points.map((point) => {
        return new Vector(point.x - vertCenter.x, point.y - vertCenter.y);
    });
    return res;
}