import { Entity, EntityStateMachine } from '@ash.ts/ash';
import { Collision, RigidBodyType } from '@core/game/components/Collision';
import { CharacterView } from '@core/game/graphics/CharacterView';
import { Transform } from '@core/game/components/Transform';
import { Display } from '@core/game/components/Display';
import { InputControlView } from '@core/game/graphics/InputControlView';
import { Motion } from '@core/game/components/Motion';
import { InputControl } from '@core/game/components/InputControl';
import { BulletView } from '@core/game/graphics/BulletView';
import { Pistol } from '@core/game/components/weapon/Pistol';
import { Character } from '@core/game/components/Character';
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
import { RigidBody } from '@core/game/components/RigidBody';
import { Game } from '@core/game/Game';

export interface IEntityCreatorConfig {
    width: number;
    height: number;
}

export class EntityCreator {
    public constructor(private game: Game) {}

    public removeEntity(entity: Entity): void {
        this.game.engine.removeEntity(entity);
    }

    public createCharacter(): Entity {
        const character: Entity = new Entity('Character');

        const fsm = new EntityStateMachine(character);

        const vertices = createVerticesByPoints([
            new Vector(0, 0),
            new Vector(60, 0),
            new Vector(60, 30),
            new Vector(0, 30)
        ]);

        fsm.createState('white')
            .add(Display)
            .withInstance(new Display(new CharacterView(0xFFFFFF, vertices)));

        fsm.createState('red')
            .add(Display)
            .withInstance(new Display(new CharacterView(0xFF0000, vertices)));

        character
            .add(new Motion())
            .add(new Pistol())
            .add(new Character(fsm))
            .add(new Transform())
            .add(new RigidBody(this.game.physics, {
                width: 60,
                height: 30,
                rigidbodyType: RigidBodyType.Dynamic
            }));

        fsm.changeState('white');

        this.game.engine.addEntity(character);

        // @ts-ignore
        window.Character = character;

        return character;
    }

    public createInputControl(): Entity {
        const input = new Entity('InputControl');
        const inputControlView = new InputControlView(this.game.config.width, this.game.config.height);

        const fsm = new EntityStateMachine(input);

        fsm.createState('enabled')
            .add(Display)
            .withInstance(new Display(inputControlView))
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

    public createBullet(from: Vector, dir: Vector): Entity {
        const bullet = new Entity();

        const radius = 10;

        const bulletView = new BulletView({ radius });

        const velocity = new Vector(dir.x, dir.y);
        const position = new Vector(from.x, from.y);

        bullet
            .add(new Display(bulletView))
            .add(new Transform(position))
            .add(new Motion({ velocity, moveSpeed: 600 }))
            .add(new Collision({ radius, type: PrimitiveType.Circle }))
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
            .add(new Display(wallView))
            .add(new Wall())
            .add(new RigidBody(this.game.physics, {
                width: 30,
                height: 200,
                rigidbodyType: RigidBodyType.Static
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
            const bulletView = new BulletView({ radius, color: 0xFFFF00 });
            const rad = angleOfDir - angleOfDefeat / 2 + i * angleStep;
            const velocity = dir.setAngle(rad).normalize();
            const x = from.x + randomRange(-2, 2);
            const y = from.y + randomRange(-2, 2);
            const position = new Vector(x, y);

            bullet
                .add(new Display(bulletView))
                .add(new Transform(position))
                .add(new Motion({ velocity, moveSpeed: randomInt(600, 900) }))
                .add(new Collision({ radius, type: PrimitiveType.Circle }))
                .add(new Bullet());

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
            .add(new Display(new PistolView({ width, height })))
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
            .add(new Display(new ShotgunView({ width, height })))
            .add(new TriggerZone({ type: PrimitiveType.Rect, width, height }))
            .add(new Transform({ x: pos.x, y: pos.y }))
            .add(new WeaponItem({ type: WeaponType.Shotgun }));

        this.game.engine.addEntity(item);

        return item;
    }
}