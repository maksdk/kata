import { Container } from 'pixi.js';
import { defineNode, Engine, NodeList, System } from '@ash.ts/ash';
import { Display } from '@core/game/components/Display';
import { Transform } from '@core/game/components/Transform';

export enum RenderViewLayer {
    Depth = 0,
    World = 1,
    Debug = 2,
    UI = 3,
}

const RenderNode = defineNode({
    display: Display,
    transform: Transform,
}, 'RenderNode');

type RenderNode = InstanceType<typeof RenderNode>;

export class RenderSystem extends System {
    private layers: Map<RenderViewLayer, Container> = new Map();
    private renderNodes: NodeList<RenderNode> | null = null;
    
    public constructor(private stage: Container) {
        super();

        this.layers.set(RenderViewLayer.Depth, new Container());
        this.layers.set(RenderViewLayer.World, new Container());
        this.layers.set(RenderViewLayer.Debug, new Container());
        this.layers.set(RenderViewLayer.UI, new Container());
    }

    public addToEngine(engine: Engine): void {
        const depthContainer = this.layers.get(RenderViewLayer.World);
        const debugContainer = this.layers.get(RenderViewLayer.Debug);
        this.stage.addChild(depthContainer);
        this.stage.addChild(debugContainer);

        this.renderNodes = engine.getNodeList(RenderNode);

        for (let node: null | RenderNode = this.renderNodes.head; node; node = node.next) {
            this.addToDisplay(node);
        }

        this.renderNodes.nodeAdded.add((node: RenderNode) => this.addToDisplay(node));
        this.renderNodes.nodeRemoved.add((node: RenderNode) => this.removeFromDisplay(node));

        window.addEventListener('resize', () => this.onResize(), true);
    }

    public removeFromEngine(): void {
        this.renderNodes.nodeAdded.remove((node: RenderNode) => this.addToDisplay(node));
        this.renderNodes.nodeRemoved.remove((node: RenderNode) => this.removeFromDisplay(node));
        this.renderNodes = null;

        this.layers.forEach(c => c.destroy());

        window.removeEventListener('resize', () => this.onResize(), true);
    }

    public update(): void {
        for (let node = this.renderNodes.head; node; node = node.next) {
            const { display, transform } = node;
            const { view } = display;
            const { x, y, sx, sy, rotation } = transform;
            view.setTransform(x, y, sx, sy, rotation);
        }
    }

    private addToDisplay(node: RenderNode): void {
        const { view, layer } = node.display;
        const container = this.layers.get(layer);
        if (container) {
            container.addChild(view);
        }
    }

    private removeFromDisplay(node: RenderNode): void {
        const { view, layer } = node.display;
        const container = this.layers.get(layer);
        if (container) {
            container.removeChild(view);
        }
    }

    // TODO: Improve logic. Use from playbleads
    private onResize(): void {
        for (let node = this.renderNodes.head; node; node = node.next) {
            const { display } = node;
            display.resize();
        }
    }
}