import { Collision, CollisionShapeType } from '@core/game/components/Collision';
import { Engine, Entity, EntityStateMachine } from '@ash.ts/ash';
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
import { TriggerTarget } from '@core/game/components/TriggerTarget';
import { randomInt, randomRange } from '@core/game/math/helpers';
import { WeaponItem } from '@core/game/components/weapon/WeaponItem';
import { WeaponType } from '@core/game/constants';
import { ShotgunView } from '@core/game/graphics/ShotgunView';
import { PistolView } from '@core/game/graphics/PistolItemView';
import { Input } from '@core/game/components/Input';

export interface IEntityCreatorConfig {
    width: number;
    height: number;
}

export class EntityCreator {
    public constructor(private engine: Engine, private config: IEntityCreatorConfig) {

    }

    public removeEntity(entity: Entity): void {
        this.engine.removeEntity(entity);
    }

    public createCharacter(): Entity {
        const character: Entity = new Entity('Character');

        const fsm = new EntityStateMachine(character);

        fsm.createState('white')
            .add(Display)
            .withInstance(new Display(new CharacterView(0xFFFFFF)));

        fsm.createState('red')
            .add(Display)
            .withInstance(new Display(new CharacterView(0xFF0000)));

        character
            .add(new Motion())
            .add(new Transform())
            .add(new Pistol())
            .add(new TriggerTarget())
            .add(new Character(fsm));

        fsm.changeState('white');

        this.engine.addEntity(character);

        // @ts-ignore
        window.Character = character;

        return character;
    }

    public createInputControl(): Entity {
        const input = new Entity('InputControl');
        const inputControlView = new InputControlView(this.config.width, this.config.height);

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

        fsm.changeState('disabled');

        input.add(new Input(fsm));

        this.engine.addEntity(input);

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
            .add(new Collision({ radius, type: CollisionShapeType.Circle }))
            .add(new Bullet());

        this.engine.addEntity(bullet);

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
            .add(new Collision({ type: CollisionShapeType.Rect, width: 30, height: 200 }));

        this.engine.addEntity(wall);

        return wall;
    }

    public createDebugCollisionShape(props: { type: CollisionShapeType, polygon: Vector[], radius: number }): Entity {
        const shape = new Entity();

        const shapeView = new DebugCollisionShapeView({
            type: props.type,
            polygon: props.polygon,
            radius: props.radius,
        });

        shape.add(new Display(shapeView, RenderViewLayer.Debug))
            .add(new Transform({ x: 0, y: 0 }));

        this.engine.addEntity(shape);

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
                .add(new Collision({ radius, type: CollisionShapeType.Circle }))
                .add(new Bullet());

            this.engine.addEntity(bullet);

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
            .add(new TriggerZone({ type: CollisionShapeType.Rect, width, height }))
            .add(new Transform({ x: pos.x, y: pos.y }));

        this.engine.addEntity(trigger);

        return trigger;
    }

    public createPistolItem(): Entity {
        const pos = new Vector(
            randomInt(-this.config.width * 0.4, this.config.width * 0.4),
            randomInt(-this.config.height * 0.4, this.config.height * 0.4)
        );
        const width = 20;
        const height = 20;
        const item = new Entity();

        item
            .add(new Display(new PistolView({ width, height })))
            .add(new TriggerZone({ type: CollisionShapeType.Rect, width, height }))
            .add(new Transform({ x: pos.x, y: pos.y }))
            .add(new WeaponItem({ type: WeaponType.Pistol }));

        this.engine.addEntity(item);

        return item;
    }

    public createShotgunItem(): Entity {
        const pos = new Vector(
            randomInt(-this.config.width * 0.4, this.config.width * 0.4),
            randomInt(-this.config.height * 0.4, this.config.height * 0.4)
        );
        const width = 20;
        const height = 20;
        const item = new Entity();

        item
            .add(new Display(new ShotgunView({ width, height })))
            .add(new TriggerZone({ type: CollisionShapeType.Rect, width, height }))
            .add(new Transform({ x: pos.x, y: pos.y }))
            .add(new WeaponItem({ type: WeaponType.Shotgun }));

        this.engine.addEntity(item);

        return item;
    }
}