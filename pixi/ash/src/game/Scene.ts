import { Container, DisplayObject } from 'pixi.js';

export enum SceneLayer {
    Depth,
    World,
    Debug,
    UI,
}

export class Scene {
    private layers: Map<SceneLayer, Container> = new Map();
    
    public constructor(private stage: Container) {
        const depth = new Container();
        this.stage.addChild(depth);
        this.layers.set(SceneLayer.Depth, depth);

        const world = new Container();
        this.stage.addChild(world);
        this.layers.set(SceneLayer.World, world);

        const debug = new Container();
        this.stage.addChild(debug);
        this.layers.set(SceneLayer.Debug, debug);

        const ui = new Container();
        this.stage.addChild(ui);
        this.layers.set(SceneLayer.UI, ui);
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
}
