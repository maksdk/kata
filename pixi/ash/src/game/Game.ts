import { Engine, FrameTickProvider } from '@ash.ts/ash';
import { EntityCreator } from '@core/game/EntityCreator';
import { GunControlSystem } from '@core/game/systems/GunControlSystem';
import { InputControlSystem } from '@core/game/systems/InputControlSystem';
import { MovementSystem } from '@core/game/systems/MovementSystem';
import { MotionControlSystem } from '@core/game/systems/MotionControlSystem';
import { RenderSystem } from '@core/game/systems/RenderSystem';

enum SystemPriorities {
    PreUpdate = 1,
    Update = 2,
    Move = 3,
    Collision = 4,
    Animation = 5,
    Render = 5,
    Audio = 6,
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
        engine.addSystem(new RenderSystem(config), SystemPriorities.Render);    
        
        entityCreator.createCharacter();
        entityCreator.createInputControl();
        
        // @ts-ignore
        window.Engine = engine;
    }
}
