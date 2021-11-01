import { Entity, EntityStateMachine } from '@ash.ts/ash';
import { RigidBodyType } from '@core/game/components/Collision';
import { PlayerView } from '@core/game/graphics/PlayerView';
import { Transform } from '@core/game/components/Transform';
import { Display } from '@core/game/components/Display';
import { InputControlView } from '@core/game/graphics/InputControlView';
import { InputMotion } from '@core/game/components/InputMotion';
import { InputControl } from '@core/game/components/InputControl';
import { BulletView } from '@core/game/graphics/BulletView';
import { Pistol } from '@core/game/components/weapon/Pistol';
import { Character, CharacterGroup } from '@core/game/components/Character';
import { Vector } from '@core/game/math/Vector';
import { WallView } from '@core/game/graphics/WallView';
import { DebugCollisionShapeView } from '@core/game/graphics/DebugCollisionShapeView';
import { RenderViewLayer } from '@core/game/systems/RenderSystem';
import { Wall } from '@core/game/components/Wall';
import { Bullet } from '@core/game/components/Bullet';
import { TriggerZone } from '@core/game/components/TriggerZone';
import { randomInt, randomRange } from '@core/game/math/helpers';
import { WeaponItem } from '@core/game/components/weapon/WeaponItem';
import { PrimitiveType, WeaponType } from '@core/game/constants';
import { ShotgunView } from '@core/game/graphics/ShotgunView';
import { PistolView } from '@core/game/graphics/PistolItemView';
import { Input } from '@core/game/components/Input';
import { createVerticesByPoints } from '@core/game/math/Physics';
import { IRigidBodyOptions, RigidBody } from '@core/game/components/RigidBody';
import { Game } from '@core/game/Game';
import { EnemyView } from '@core/game/graphics/EnemyView';

export interface IEntityCreatorConfig {
    width: number;
    height: number;
}

export class EntityCreator {
    public constructor(private game: Game) {}

    public removeEntity(entity: Entity): void {
        this.game.engine.removeEntity(entity);
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
            .add(Pistol)
            .withInstance(new Pistol());

        fsm.createState('motion')
            .add(InputMotion)
            .withInstance(new InputMotion());

        player
            .add(new Character({ fsm, group: CharacterGroup.Singleton }))
            .add(new Display(new PlayerView(0xFF0000, vertices), RenderViewLayer.World))
            .add(new Transform({ maxWidth: 40, maxHeight: 30 }))
            .add(new RigidBody(this.game.physics, {
                vertices,
                rigidbodyType: RigidBodyType.Dynamic,
                primitiveType: PrimitiveType.Polygon
            }));

        fsm.changeState('shooting');

        this.game.engine.addEntity(player);

        // @ts-ignore
        window.Player = player;

        return player;
    }

    public createEnemy(): Entity {
        const enemy: Entity = new Entity('Enemy');

        enemy
            .add(new Character({ group: CharacterGroup.Singleton }))
            .add(new Display(new EnemyView({ width: 50, height: 50 }), RenderViewLayer.World))
            .add(new Transform({ x: 0, y: -200 }))
            .add(new RigidBody(this.game.physics, {
                width: 50,
                height: 50,
                rigidbodyType: RigidBodyType.Dynamic,
                primitiveType: PrimitiveType.Rect
            }));


        this.game.engine.addEntity(enemy);

        // @ts-ignore
        window.Enemy = enemy;

        return enemy;
    }

    public createInputControl(): Entity {
        const input = new Entity('InputControl');
        const inputControlView = new InputControlView(this.game.config.width, this.game.config.height);

        const fsm = new EntityStateMachine(input);

        fsm.createState('enabled')
            .add(Display)
            .withInstance(new Display(inputControlView, RenderViewLayer.World))
            .add(Transform)
            .withInstance(new Transform())
            .add(InputControl)
            .withInstance(new InputControl(inputControlView));

        fsm.createState('disabled')
            .add(InputControl)
            .withInstance(new InputControl());

        fsm.changeState('enabled');

        input.add(new Input(fsm));

        this.game.engine.addEntity(input);

        return input;
    }

    public createBullet(from: Vector, options: Partial<IRigidBodyOptions> = {}): Entity {
        const bullet = new Entity(`Bullet-${Math.random()}`);

        const { radius = 10 } = options;

        const bulletView = new BulletView({ radius });

        bullet
            .add(new Display(bulletView, RenderViewLayer.World))
            .add(new Transform(from))
            .add(new RigidBody(this.game.physics, {
                radius,
                rigidbodyType: RigidBodyType.Dynamic,
                primitiveType: PrimitiveType.Circle,
                label: 'Bullet',
                ...options
            }))
            .add(new Bullet());

        this.game.engine.addEntity(bullet);

        return bullet;
    }

    public createWall(): Entity {
        const wall = new Entity('Wall');

        const p = new Vector(100, 0);

        const wallView = new WallView({
            width: 30,
            height: 200,
        });

        wall.add(new Transform({ x: p.x, y: p.y }))
            .add(new Display(wallView, RenderViewLayer.World))
            .add(new Wall())
            .add(new RigidBody(this.game.physics, {
                width: 30,
                height: 200,
                rigidbodyType: RigidBodyType.Static,
                primitiveType: PrimitiveType.Rect,
                angle: 0,
                label: 'Wall',
            }));

        this.game.engine.addEntity(wall);

        return wall;
    }

    public createDebugCollisionShape(props: { type: PrimitiveType, polygon: Vector[], radius: number }): Entity {
        const shape = new Entity();

        const shapeView = new DebugCollisionShapeView({
            type: props.type,
            polygon: props.polygon,
            radius: props.radius,
        });

        shape.add(new Display(shapeView, RenderViewLayer.Debug))
            .add(new Transform({ x: 0, y: 0 }));

        this.game.engine.addEntity(shape);

        return shape;
    }

    public createBuckshotBullet(from: Vector, dir: Vector): Entity[] {
        const count = 5;
        const radius = 2;
        const bullets: Entity[] = [];
        const angleOfDefeat = Math.PI * 0.15;
        const angleOfDir = dir.getAngle();
        const angleStep = angleOfDefeat / count;

        for (let i = 0; i < count; i += 1) {
            const bullet = new Entity();
            const bulletView = new BulletView({ radius, color: 0x00FF00 });
            const rad = angleOfDir - angleOfDefeat / 2 + i * angleStep;
            const velocity = dir.setAngle(rad).normalize();
            const x = from.x + randomRange(-2, 2);
            const y = from.y + randomRange(-2, 2);
            const position = new Vector(x, y);

            bullet
                .add(new Display(bulletView, RenderViewLayer.World))
                .add(new Transform(position));
                // .add(new RigidBody(this.game.physics, {
                //     primitiveType: PrimitiveType.Circle,
                //     rigidbodyType: RigidBodyType.Dynamic,
                //     radius,
                //     label: 'Particles',
                //     velocity,
                //     friction: 0,
                //     frictionAir: 0,
                //     isTrigger: true,
                // }))
                // .add(new Bullet());

            this.game.engine.addEntity(bullet);

            bullets.push(bullet);
        }

        return bullets;
    }

    public createTrigger(): Entity {
        const trigger = new Entity('TriggerZone');

        const pos = new Vector(0, -200);
        const width = 50;
        const height = 50;

        trigger
            .add(new TriggerZone({ type: PrimitiveType.Rect, width, height }))
            .add(new Transform({ x: pos.x, y: pos.y }));

        this.game.engine.addEntity(trigger);

        return trigger;
    }

    public createPistolItem(): Entity {
        const pos = new Vector(
            randomInt(-this.game.config.width * 0.4, this.game.config.width * 0.4),
            randomInt(-this.game.config.height * 0.4, this.game.config.height * 0.4)
        );
        const width = 20;
        const height = 20;
        const item = new Entity();

        item
            .add(new Display(new PistolView({ width, height }), RenderViewLayer.World))
            .add(new TriggerZone({ type: PrimitiveType.Rect, width, height }))
            .add(new Transform({ x: pos.x, y: pos.y }))
            .add(new WeaponItem({ type: WeaponType.Pistol }));

        this.game.engine.addEntity(item);

        return item;
    }

    public createShotgunItem(): Entity {
        const pos = new Vector(
            randomInt(-this.game.config.width * 0.4, this.game.config.width * 0.4),
            randomInt(-this.game.config.height * 0.4, this.game.config.height * 0.4)
        );
        const width = 20;
        const height = 20;
        const item = new Entity();

        item
            .add(new Display(new ShotgunView({ width, height }), RenderViewLayer.World))
            .add(new TriggerZone({ type: PrimitiveType.Rect, width, height }))
            .add(new Transform({ x: pos.x, y: pos.y }))
            .add(new WeaponItem({ type: WeaponType.Shotgun }));

        this.game.engine.addEntity(item);

        return item;
    }
}