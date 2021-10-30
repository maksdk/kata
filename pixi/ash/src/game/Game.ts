import { PistolControlSystem } from './systems/PistolControlSystem';
import { Engine, FrameTickProvider } from '../libs/ash';
import { EntityCreator } from '@core/game/EntityCreator';
import { CollisionSystem } from '@core/game/systems/CollisionSystem';
import { RenderSystem } from '@core/game/systems/RenderSystem';
import { Physics } from '@core/game/math/Physics';
import { Vector } from '@core/game/math/Vector';
import { MotionControlSystem } from '@core/game/systems/MotionControlSystem';
import { Application } from 'pixi.js';
import { BulletSystem } from '@core/game/systems/BulletSystem';
import { ClearFrameSystem } from '@core/game/systems/ClearFrameSystem';

enum SystemPriorities {
    PreUpdate,
    Update,
    Move,
    PreCollision,
    Collision,
    Animation,
    Debug,
    Render,
    Audio,
    AfterFrame,
}

export class Game {
    public readonly engine: Engine;
    public readonly ticker: FrameTickProvider;
    public readonly entityCreator: EntityCreator;
    public readonly config = { width: window.innerWidth, height: window.innerHeight };
    public readonly physics: Physics;
    private readonly app: Application;

    public constructor() {
        this.app = new Application({
            width: this.config.width,
            height: this.config.height,
            backgroundColor: 0,
        });
        this.app.stage.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);

        this.engine = new Engine();

        this.ticker = new FrameTickProvider();

        this.entityCreator = new EntityCreator(this);

        this.physics = new Physics({
            width: this.config.width,
            height: this.config.height,
            isDebug: true,
            worldPosition: new Vector(this.config.width / 2, this.config.height / 2)
        });
    }

    public create(): void {
        this.engine.addSystem(new MotionControlSystem(), SystemPriorities.PreUpdate); 
        this.engine.addSystem(new PistolControlSystem(this.entityCreator), SystemPriorities.Update); 
        this.engine.addSystem(new BulletSystem(this), SystemPriorities.Update); 
        this.engine.addSystem(new CollisionSystem(this.physics), SystemPriorities.Collision);   
        this.engine.addSystem(new RenderSystem(this.app.stage), SystemPriorities.Render);    
        this.engine.addSystem(new ClearFrameSystem(this), SystemPriorities.AfterFrame);   

        if (this.physics) {
            this.physics.run();
        }

        this.entityCreator.createWall();
        this.entityCreator.createCharacter();
        this.entityCreator.createInputControl();

        document.body.appendChild(this.app.view);

        this.ticker.add((dt: number) => {
            this.engine.update(dt);
            this.app.renderer.render(this.app.stage);
        });
        this.ticker.start();
        
        // @ts-ignore
        window.Game = this;
    }
}