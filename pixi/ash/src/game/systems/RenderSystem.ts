import { defineNode, Engine, NodeList, System } from '@ash.ts/ash';
import { Display } from '@core/game/components/Display';
import { Transform } from '@core/game/components/Transform';
import { Application, Container, Renderer } from 'pixi.js';

export interface IRenderSystemOptions {
    width: number;
    height: number;
}

export enum RenderViewLayer {
    Depth = 0,
    World = 1,
    UI = 2,
    Debug = 3,
}

const RenderNode = defineNode({
    display: Display,
    transform: Transform,
}, 'RenderNode');

type RenderNode = InstanceType<typeof RenderNode>;

export class RenderSystem extends System {
    private app: Application;
    private stage: Container;
    private view: HTMLCanvasElement;
    private renderer: Renderer;
    private layers: Map<RenderViewLayer, Container> = new Map();
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
    
        this.layers.set(RenderViewLayer.Depth, new Container());
        this.layers.set(RenderViewLayer.Debug, new Container());
    }

    // call when system add to ash system
    public addToEngine(engine: Engine): void {
        document.body.appendChild(this.view);
    
        const depthContainer = this.layers.get(RenderViewLayer.Depth);
        const debugContainer = this.layers.get(RenderViewLayer.Debug);
        if (depthContainer) {
            depthContainer.position.set(this.renderer.width / 2, this.renderer.height / 2);
            this.stage.addChild(depthContainer);
    
            debugContainer.position.set(this.renderer.width / 2, this.renderer.height / 2);
            this.stage.addChild(debugContainer);
        }

        this.renderNodes = engine.getNodeList(RenderNode);

        for (let node: null | RenderNode = this.renderNodes.head; node; node = node.next) {
            this.addToDisplay(node);
        }

        this.renderNodes.nodeAdded.add((node: RenderNode) => this.addToDisplay(node));
        this.renderNodes.nodeRemoved.add((node: RenderNode) => this.removeFromDisplay(node));
    }

    public removeFromEngine(): void {
        this.stage.destroy();
        this.renderer.destroy();
        this.app.destroy();

        this.renderNodes = null;
    }

    public update(): void {
        for (let node = this.renderNodes.head; node; node = node.next) {
            const { display, transform } = node;
            const { displayObject } = display;
            const { x, y, sx, sy, rotation } = transform;
            displayObject.setTransform(x, y, sx, sy, rotation);
        }

        this.renderer.render(this.stage);
    }

    private addToDisplay(node: RenderNode): void {
        const { displayObject, layer = RenderViewLayer.Depth } = node.display;
        const container = this.layers.get(layer);
        if (container) {
            container.addChild(displayObject);
        }
    }

    private removeFromDisplay(node: RenderNode): void {
        const { displayObject, layer = RenderViewLayer.Depth } = node.display;
        const container = this.layers.get(layer);
        if (container) {
            container.removeChild(displayObject);
        }
    }
}