import { FrameTickProvider } from '../libs/ash';
import { Application, Container, DisplayObject } from 'pixi.js';
import { World } from '@core/game/World';
import { Scene } from '@core/game/Scene';

export class GameplayState {
    public width: number;
    public height: number;
    public characters: { id: string; weaponId: string | null; }[];
    public weapons: { id: string; type: string; ownerId: string | null; }[];
    public settings: {
        weapons: { type: string; power: number; }[];
    };
}

export class Game {
    private readonly app: Application;
    private readonly ticker: FrameTickProvider;
    private readonly state: GameplayState;
    private readonly world: World;
    private readonly scene: Scene;

    public constructor() {
        this.state = new GameplayState();
        this.state.width = window.innerWidth;
        this.state.height = window.innerHeight;

        this.app = new Application({
            width: this.state.width,
            height: this.state.height,
            backgroundColor: 0,
        });

        this.scene = new Scene(this.app.stage);
        
        this.world = new World(this.scene, this.state);

        this.ticker = new FrameTickProvider();
    }

    public start(): void {
        this.app.stage.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
        document.body.appendChild(this.app.view);

        this.world.start();

        this.ticker.add((dt: number) => {
            this.app.renderer.render(this.app.stage);
            this.world.update(dt);
        });
        this.ticker.start();

        this.world.createPlayer();
        
        // @ts-ignore
        window.Game = this;
    }
}


