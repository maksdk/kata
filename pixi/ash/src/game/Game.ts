import { FrameTickProvider } from '../libs/ash';
import { Application } from 'pixi.js';
import { World } from '@core/game/World';
import { Scene, SceneLayer } from '@core/game/Scene';
import { InputController } from '@core/game/InputController';
import { WeaponType } from '@core/game/constants';

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
    private readonly input: InputController;

    public constructor() {
        this.state = new GameplayState();
        this.state.width = window.innerWidth;
        this.state.height = window.innerHeight;

        this.app = new Application({
            width: this.state.width,
            height: this.state.height,
            backgroundColor: 0,
        });

        this.scene = new Scene(this.app);
        this.input = new InputController(this.scene);
        this.world = new World(this.scene, this.state, this.input);
        this.ticker = new FrameTickProvider();

        console.log('Window size: ', this.state.width, this.state.height);
    }

    public start(): void {
        document.body.appendChild(this.app.view);

        this.scene.addChild(this.input.view, SceneLayer.Input);

        this.world.start();

        this.ticker.add((dt: number) => {
            this.app.renderer.render(this.app.stage);
            this.world.update(dt);
        });
        this.ticker.start();

        this.world.createPlayer();
        this.world.createEnemy();

        this.world.createWeaponItem({ type: WeaponType.Pistol });
        this.world.createWeaponItem({ type: WeaponType.Shotgun });

        // @ts-ignore
        window.Game = this;
    }
}