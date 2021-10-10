import { Engine, Entity, EntityStateMachine } from '@ash.ts/ash';
import { CharacterView } from '@core/game/graphics/CharacterView';
import { Transform } from '@core/game/components/Transform';
import { Display } from '@core/game/components/Display';
import { InputControlView } from '@core/game/graphics/InputControlView';
import { Motion } from '@core/game/components/Motion';
import { InputControl } from '@core/game/components/InputControl';
import { BulletView } from '@core/game/graphics/BulletView';
import { Bullet } from '@core/game/components/Bullet';
import { Gun } from '@core/game/components/Gun';
import { Character } from '@core/game/components/Character';
import { Vector } from '@core/game/math/Vector';

export interface IEntityCreatorConfig {
    width: number;
    height: number;
}

export class EntityCreator {
    public constructor(private engine: Engine, private config: IEntityCreatorConfig) {

    }

    public createCharacter(): Entity {
        const character: Entity = new Entity('Character');
        const characterView = new CharacterView();

        const fsm = new EntityStateMachine(character);

        fsm.createState('playing')
            .add(Motion)
            .withInstance(new Motion())
            .add(Transform)
            .withInstance(new Transform())
            .add(Gun)
            .withInstance(new Gun());

        character.add(new Display(characterView))
            .add(new Character(fsm));

        fsm.changeState('playing');

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

    public createBullet(from: {x: number; y: number; }, dir: { x: number; y: number; }): Entity {
        const bullet = new Entity();
        const bulletView = new BulletView();

        const velocity = new Vector(dir.x, dir.y);
        const position = new Vector(from.x, from.y);

        bullet
            .add(new Display(bulletView))
            .add(new Transform(position))
            .add(new Motion( {velocity, moveSpeed: 600 }));
    
        this.engine.addEntity(bullet);
    
        return bullet;
    }
}