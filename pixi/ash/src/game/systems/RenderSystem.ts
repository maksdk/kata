import { Engine, NodeList, System } from '@ash.ts/ash';
import { RenderNode } from '@core/game/nodes';
import { Application, Container, Renderer } from 'pixi.js';

// TODO: Use display layers to split different views

export interface IRenderSystemOptions {
    width: number;
    height: number;
}

enum RenderViewLayers {
    Depth = 0,
}

export class RenderSystem extends System {
    private app: Application;
    private stage: Container;
    private view: HTMLCanvasElement;
    private renderer: Renderer;
    private layers: Map<RenderViewLayers, Container> = new Map();
    private renderNodes: NodeList<RenderNode> | null = null;
    
    public constructor(private options: IRenderSystemOptions) {
        super();

        this.app = new Application({
            width: this.options.width,
            height: this.options.height,
            backgroundColor: 0,
        });

        this.stage = this.app.stage;
        this.view = this.app.view;
        this.renderer = this.app.renderer;
    
        this.layers.set(RenderViewLayers.Depth, new Container());
    }

    // call when system add to ash system
    public addToEngine(engine: Engine): void {
        document.body.appendChild(this.view);

        const layer = this.layers.get(RenderViewLayers.Depth);
        if (layer) {
            layer.position.set(this.renderer.width / 2, this.renderer.height / 2);
            this.stage.addChild(layer);
        }

        this.renderNodes = engine.getNodeList(RenderNode);

        for (let node: null | RenderNode = this.renderNodes.head; node; node = node.next) {
            this.addToDisplay(node);
        }

        this.renderNodes.nodeAdded.add((node: RenderNode) => this.addToDisplay(node));

    }

    public removeFromEngine(engine: Engine): void {
        console.log('RenderSystem => removeFromEngine', engine);
    }

    public update(dt: number): void {
        for (let node = this.renderNodes.head; node; node = node.next) {
            const { display, transform } = node;
            const { displayObject } = display;
            const { x, y, sx, sy, rotation } = transform;
            displayObject.setTransform(x, y, sx, sy, rotation);
        }

        this.renderer.render(this.stage);
    }

    protected addToDisplay(node: RenderNode): void {
        const { displayObject } = node.display;
        const layer = this.layers.get(RenderViewLayers.Depth);
        if (layer) {
            layer.addChild(displayObject);
        }
    }
}