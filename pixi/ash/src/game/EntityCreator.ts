import { Collision, CollisionShapeType } from '@core/game/components/Collision';
import { Engine, Entity, EntityStateMachine } from '@ash.ts/ash';
import { CharacterView } from '@core/game/graphics/CharacterView';
import { Transform } from '@core/game/components/Transform';
import { Display } from '@core/game/components/Display';
import { InputControlView } from '@core/game/graphics/InputControlView';
import { Motion } from '@core/game/components/Motion';
import { InputControl } from '@core/game/components/InputControl';
import { BulletView } from '@core/game/graphics/BulletView';
import { Gun } from '@core/game/components/Gun';
import { Character } from '@core/game/components/Character';
import { Vector } from '@core/game/math/Vector';
import { WallView } from '@core/game/graphics/WallView';
import { DebugCollisionShapeView } from '@core/game/graphics/DebugCollisionShapeView';
import { RenderViewLayer } from '@core/game/systems/RenderSystem';
import { Wall } from '@core/game/components/Wall';
import { Bullet } from '@core/game/components/Bullet';
import { TriggerZone } from '@core/game/components/TriggerZone';
import { TriggerTarget } from '@core/game/components/TriggerTarget';

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
            .add(new Gun())
            .add(new TriggerTarget())
            .add(new Character(fsm));

        fsm.changeState('white');

        this.engine.addEntity(character);

        return character;
    }

    public createInputControl(): Entity {
        const input = new Entity('InputControl');
        const inputControlView = new InputControlView(this.config.width, this.config.height);

        input.add(new Display(inputControlView))
            .add(new Transform())
            .add(new InputControl(inputControlView));

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
            .add(new Motion( {velocity, moveSpeed: 600 }))
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

        wall.add(new Transform({x: p.x, y: p.y }))
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
            .add(new Transform({ x: 0, y: 0}));
        
        this.engine.addEntity(shape);

        return shape;
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
}