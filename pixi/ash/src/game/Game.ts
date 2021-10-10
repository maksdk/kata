import { Engine, FrameTickProvider } from '@ash.ts/ash';
import { EntityCreator } from '@core/game/EntityCreator';
import { CollisionSystem } from '@core/game/systems/CollisionSystem';
import { DebugSystem } from '@core/game/systems/DebugSystem';
import { GunControlSystem } from '@core/game/systems/GunControlSystem';
import { InputControlSystem } from '@core/game/systems/InputControlSystem';
import { MovementSystem } from '@core/game/systems/MovementSystem';
import { RenderSystem } from '@core/game/systems/RenderSystem';

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
    public create(): void {
        const config = { width: window.innerWidth, height: window.innerHeight };

        const engine = new Engine();
        const entityCreator = new EntityCreator(engine, config);

        const ticker = new FrameTickProvider();
        ticker.add((delta: number) => engine.update(delta));
        ticker.start();

        engine.addSystem(new InputControlSystem(), SystemPriorities.PreUpdate); 
        engine.addSystem(new GunControlSystem(entityCreator), SystemPriorities.Update);   
        engine.addSystem(new MovementSystem(), SystemPriorities.Move);   
        engine.addSystem(new CollisionSystem(entityCreator), SystemPriorities.Collision);   
        engine.addSystem(new DebugSystem(entityCreator), SystemPriorities.Debug);   
        engine.addSystem(new RenderSystem(config), SystemPriorities.Render);    
        
        entityCreator.createWall();
        entityCreator.createCharacter();
        entityCreator.createInputControl();
        
        // @ts-ignore
        window.Engine = engine;
        // @ts-ignore
        window.EntityCreator = entityCreator;
    }
}
