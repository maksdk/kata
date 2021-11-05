import { Engine, Entity, EntityStateMachine } from '@ash.ts/ash';
import { PlayerView } from '@core/game/graphics/PlayerView';
import { Transform } from '@core/game/components/Transform';
import { Display } from '@core/game/components/Display';
import { InputControlView } from '@core/game/graphics/InputControlView';
import { InputMotion } from '@core/game/components/InputMotion';
import { InputControl } from '@core/game/components/InputControl';
import { BulletView } from '@core/game/graphics/BulletView';
import { Character, CharacterGroup } from '@core/game/components/Character';
import { Vector } from '@core/game/math/Vector';
import { WallView } from '@core/game/graphics/WallView';
import { RenderSystem } from '@core/game/systems/RenderSystem';
import { Wall } from '@core/game/components/Wall';
import { Bullet } from '@core/game/components/Bullet';
import { createVerticesByPoints, Physics } from '@core/game/math/Physics';
import { IRigidBodyOptions, PrimitiveType, RigidBody, RigidBodyType } from '@core/game/components/RigidBody';
import { EnemyView } from '@core/game/graphics/EnemyView';
import { MotionControlSystem } from '@core/game/systems/MotionControlSystem';
import { PistolSystem } from '@core/game/systems/PistolSystem';
import { BulletSystem } from '@core/game/systems/BulletSystem';
import { CollisionSystem } from '@core/game/systems/CollisionSystem';
import { ClearFrameSystem } from '@core/game/systems/ClearFrameSystem';
import { SystemPriorities } from '@core/game/systems/constants';
import { GameplayState } from '@core/game/Game';
import { Scene, SceneLayer } from '@core/game/Scene';
import { InputController } from '@core/game/InputController';
import { ShootingSystem } from '@core/game/systems/ShootingSystem';
import { Shooting } from '@core/game/components/Shooting';
import { Input } from '@core/game/components/Input';
import { InputControlSystem } from '@core/game/systems/InputControlSystem';
import { CollisionClearSystem } from '@core/game/systems/CollisionClearSystem';
import { ItemView } from '@core/game/graphics/ItemView';
import { WeaponItem } from '@core/game/components/WeaponItem';
import { CollectWeaponSystem } from '@core/game/systems/CollectWeaponSystem';
import { randomInt, randomRange } from '@core/game/math/helpers';
import { WeaponType } from '@core/game/constants';
import { ShotgunSystem } from '@core/game/systems/ShotgunSystem';
import { Shotgun } from '@core/game/components/Shotgun';

export class World {
    public readonly engine: Engine;
    public readonly physics: Physics;

    public constructor(
        private readonly scene: Scene,
        private readonly state: GameplayState,
        private readonly input: InputController,
    ){
        this.engine = new Engine();

        this.physics = new Physics({
            width: this.state.width,
            height: this.state.height,
            isDebug: true,
            worldPosition: new Vector(this.state.width / 2, this.state.height / 2)
        });
    }

    public start(): void {
        this.engine.addSystem(new InputControlSystem(this.input), SystemPriorities.PreUpdate); 
        this.engine.addSystem(new MotionControlSystem(this.input), SystemPriorities.PreUpdate); 
        this.engine.addSystem(new ShootingSystem(), SystemPriorities.PreUpdate); 
        this.engine.addSystem(new PistolSystem(this), SystemPriorities.Update); 
        this.engine.addSystem(new ShotgunSystem(this), SystemPriorities.Update); 
        this.engine.addSystem(new BulletSystem(this), SystemPriorities.Update); 
        this.engine.addSystem(new CollectWeaponSystem(this), SystemPriorities.Update); 
        this.engine.addSystem(new CollisionClearSystem(), SystemPriorities.PreCollision);   
        this.engine.addSystem(new CollisionSystem(this.physics), SystemPriorities.Collision);   
        this.engine.addSystem(new RenderSystem(this.scene), SystemPriorities.Render);    
        this.engine.addSystem(new ClearFrameSystem(this), SystemPriorities.AfterFrame);   

        this.physics.start();
    }

    public update(dt: number): void {
        this.engine.update(dt);
    }

    public removeEntity(entity: Entity): void {
        this.engine.removeEntity(entity);
    }

    public createPlayer(): Entity {
        const player: Entity = new Entity('Player');

        const fsm = new EntityStateMachine(player);

        const vertices = createVerticesByPoints([
            new Vector(0, 0),
            new Vector(40, 15),
            new Vector(0, 30)
        ]);

        fsm.createState('idle');

        fsm.createState('shooting')
            .add(Shooting)
            .withInstance(new Shooting());

        fsm.createState('motion')
            .add(InputMotion)
            .withInstance(new InputMotion());

        player
            .add(new Character({ fsm, group: CharacterGroup.Singleton, id: 'main player' }))
            .add(new Input())
            .add(new Shotgun())
            .add(new Display(new PlayerView(0xFF0000, vertices), SceneLayer.World))
            .add(new Transform({ maxWidth: 40, maxHeight: 30 }))
            .add(new RigidBody(this.physics, {
                vertices,
                rigidbodyType: RigidBodyType.Dynamic,
                primitiveType: PrimitiveType.Polygon
            }));

        fsm.changeState('idle');

        this.engine.addEntity(player);

        // @ts-ignore
        window.Player = player;

        return player;
    }

    public createEnemy(): Entity {
        const enemy: Entity = new Entity('Enemy');

        enemy
            .add(new Character({ group: CharacterGroup.Singleton, id: 'enemy' }))
            .add(new Display(new EnemyView({ width: 50, height: 50 }), SceneLayer.World))
            .add(new Transform({ x: 0, y: 200 }))
            .add(new RigidBody(this.physics, {
                width: 50,
                height: 50,
                rigidbodyType: RigidBodyType.Dynamic,
                primitiveType: PrimitiveType.Rect,
                label: 'Enemy'
            }));


        this.engine.addEntity(enemy);

        // @ts-ignore
        window.Enemy = enemy;

        return enemy;
    }

    public createInputControl(): Entity {
        const input = new Entity('InputControl');
        const inputControlView = new InputControlView(this.state.width, this.state.height);
    
        input
            .add(new Display(inputControlView, SceneLayer.World))
            .add(new Transform())
            .add(new InputControl(inputControlView));

        this.engine.addEntity(input);

        return input;
    }

    public createWall(): Entity {
        const wall = new Entity('Wall');

        const p = new Vector(100, 0);

        const wallView = new WallView({
            width: 30,
            height: 200,
        });

        wall.add(new Transform({ x: p.x, y: p.y }))
            .add(new Display(wallView, SceneLayer.World))
            .add(new Wall())
            .add(new RigidBody(this.physics, {
                width: 30,
                height: 200,
                rigidbodyType: RigidBodyType.Static,
                primitiveType: PrimitiveType.Rect,
                angle: 0,
                label: 'Wall',
            }));

        this.engine.addEntity(wall);

        return wall;
    }

    public createWeaponItem(options: { type: WeaponType }): Entity {
        const item = new Entity();

        const p = new Vector(
            randomInt(-this.state.width * 0.4, this.state.width * 0.4),
            randomInt(-this.state.height * 0.4, this.state.height * 0.4)
        );

        const itemView = new ItemView();

        item.add(new Transform({ x: p.x, y: p.y }))
            .add(new Display(itemView, SceneLayer.World))
            .add(new WeaponItem({ type: options.type }));

        this.engine.addEntity(item);

        return item;
    }

    public createBullet(from: Vector, options: Partial<IRigidBodyOptions> = {}): Entity {
        const bullet = new Entity(`Bullet-${Math.random()}`);

        const { radius = 10 } = options;
        const speed = 8;

        const bulletView = new BulletView({ radius });

        bullet
            .add(new Display(bulletView, SceneLayer.World))
            .add(new Transform(from))
            .add(new RigidBody(this.physics, {
                radius,
                rigidbodyType: RigidBodyType.Dynamic,
                primitiveType: PrimitiveType.Circle,
                label: 'Bullet',
                friction: 0,
                frictionAir: 0,
                //TODO: Avoid collisions between bullets 
                collisionFilter: {
                    group: -100,
                },
                ...options,
                velocity: {
                    x: options.velocity.x * speed,
                    y: options.velocity.y * speed,
                }
            }))
            .add(new Bullet());

        this.engine.addEntity(bullet);

        return bullet;
    }

    public createBuckshotBullet(from: Vector, options: Partial<IRigidBodyOptions>): Entity[] {
        const count = 10;
        const radius = 2;
        const bullets: Entity[] = [];
        const angleOfDefeat = Math.PI * 0.15;
        const dir = new Vector(options.velocity.x, options.velocity.y).normalize();
        const angleOfDir = dir.getAngle();
        const angleStep = angleOfDefeat / count;
        const speed = 8;

        for (let i = 0; i < count; i += 1) {
            const bullet = new Entity();
            const bulletView = new BulletView({ radius, color: 0xFFFF00 });
            const rad = angleOfDir - angleOfDefeat / 2 + i * angleStep;
            const velocity = dir.setAngle(rad).normalize().mulScalar(speed);
            const x = from.x + randomRange(-2, 2);
            const y = from.y + randomRange(-4, 4);
            const position = new Vector(x, y);

            bullet
                .add(new Display(bulletView, SceneLayer.World))
                .add(new Transform(position))
                .add(new Bullet())
                .add(new RigidBody(this.physics, {
                    radius,
                    rigidbodyType: RigidBodyType.Dynamic,
                    primitiveType: PrimitiveType.Circle,
                    label: 'Shotgun',
                    friction: 0,
                    frictionAir: 0,
                    //TODO: Avoid collisions between bullets 
                    collisionFilter: {
                        group: -100,
                    },
                    ...options,
                    velocity,
                }));

            this.engine.addEntity(bullet);

            bullets.push(bullet);
        }

        return bullets;
    }
}