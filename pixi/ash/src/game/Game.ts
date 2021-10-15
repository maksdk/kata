import { Engine, FrameTickProvider } from '@ash.ts/ash';
import { EntityCreator } from '@core/game/EntityCreator';
import { CollisionSystem } from '@core/game/systems/CollisionSystem';
import { DebugSystem } from '@core/game/systems/DebugSystem';
import { PistolControlSystem } from '@core/game/systems/weapon/PistolControlNode';
import { InputControlSystem } from '@core/game/systems/InputControlSystem';
import { MovementSystem } from '@core/game/systems/MovementSystem';
import { RenderSystem } from '@core/game/systems/RenderSystem';
import { TriggerSystem } from '@core/game/systems/TriggerSystem';
import { ShotgunControlSystem } from '@core/game/systems/weapon/ShotgunControlSystem';
import { PickingUpItemSystem } from '@core/game/systems/PickingUpItemSystem';
import { WeaponControlSystem } from '@core/game/systems/weapon/WeaponControlSystem';

enum SystemPriorities {
    PreUpdate = 1,
    Update = 2,
    Move = 3,
    Collision = 4,
    Animation = 5,
    Debug = 6,
    Render = 7,
    Audio = 8,
}

export class Game {
    private readonly engine: Engine;
    private readonly ticker: FrameTickProvider;
    private readonly entityCreator: EntityCreator;
    private readonly config = { width: window.innerWidth, height: window.innerHeight };

    public constructor() {
        this.engine = new Engine();
        this.ticker = new FrameTickProvider();
        this.entityCreator = new EntityCreator(this.engine, this.config);
    }

    public create(): void {
        this.ticker.add((delta: number) => this.engine.update(delta));
        this.ticker.start();

        this.engine.addSystem(new InputControlSystem(), SystemPriorities.PreUpdate); 

        this.engine.addSystem(new PistolControlSystem(this.entityCreator), SystemPriorities.Update);   
        this.engine.addSystem(new ShotgunControlSystem(this.entityCreator), SystemPriorities.Update);  
        this.engine.addSystem(new PickingUpItemSystem(this.entityCreator), SystemPriorities.Update);  
        this.engine.addSystem(new WeaponControlSystem(), SystemPriorities.Update);  
 
        this.engine.addSystem(new MovementSystem(), SystemPriorities.Move);   
        this.engine.addSystem(new CollisionSystem(this.entityCreator), SystemPriorities.Collision);   
        this.engine.addSystem(new TriggerSystem(this.entityCreator), SystemPriorities.Collision);   
        this.engine.addSystem(new DebugSystem(this.entityCreator), SystemPriorities.Debug);   
        this.engine.addSystem(new RenderSystem(this.config), SystemPriorities.Render);    
        
        this.entityCreator.createTrigger();
        this.entityCreator.createPistolItem();
        this.entityCreator.createShotgunItem();
        this.entityCreator.createWall();
        this.entityCreator.createCharacter();
        this.entityCreator.createInputControl();
        
        // @ts-ignore
        window.Game = this;
    }
}
