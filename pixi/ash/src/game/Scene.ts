import { Application, Container, DisplayObject, utils } from 'pixi.js';

export enum SceneLayer {
    Depth,
    World,
    Debug,
    Input,
    UI,
}

export class Scene extends utils.EventEmitter {
    private layers: Map<SceneLayer, Container> = new Map();
    private stage: Container;

    public constructor(private app: Application) {
        super();

        this.stage = this.app.stage;

        const depth = new Container();
        this.stage.addChild(depth);
        this.layers.set(SceneLayer.Depth, depth);

        const world = new Container();
        this.stage.addChild(world);
        this.layers.set(SceneLayer.World, world);

        const debug = new Container();
        this.stage.addChild(debug);
        this.layers.set(SceneLayer.Debug, debug);

        const input = new Container();
        this.stage.addChild(input);
        this.layers.set(SceneLayer.Input, input);

        const ui = new Container();
        this.stage.addChild(ui);
        this.layers.set(SceneLayer.UI, ui);

        this.app.stage.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);

        window.addEventListener('resize', () => this.onResize(), true);

        console.log('Render size: ', this.app.renderer.width, this.app.renderer.height);
    }

    public get width(): number {
        return this.app.renderer.width;
    }

    public get height(): number {
        return this.app.renderer.height;
    }

    public getLayer(layer: SceneLayer): DisplayObject {
        const container = this.layers.get(layer);
        if (container) {
            return container;
        } else {
            console.error(`Scene - getLayer. Such layer is not found: "${layer}"`);
        }

        return this.layers.get(SceneLayer.UI);
    }

    public addChild(child: DisplayObject, layer: SceneLayer): DisplayObject {
        const container = this.layers.get(layer);
        if (container) {
            container.addChild(child);
        } else {
            console.error(`Scene - addChild. Such layer is not found: "${layer}"`);
        }
        return child;
    }

    public removeChild(child: DisplayObject, layer: SceneLayer): void {
        const container = this.layers.get(layer);
        if (container) {
            container.removeChild(child);
        } else {
            console.error(`Scene - removeChild. Such layer is not found: "${layer}"`);
        }
    }

    public removeAll(layer: SceneLayer): void {
        const container = this.layers.get(layer);
        if (container) {
            container.removeChildren();
        } else {
            console.error(`Scene - removeAll. Such layer is not found: "${layer}"`);
        }
    }

    private onResize(): void {
        this.app.stage.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
        this.emit('resize');
    }
}
