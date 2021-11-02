import { defineNode, Engine, NodeList, System } from '@ash.ts/ash';
import { Display } from '@core/game/components/Display';
import { Transform } from '@core/game/components/Transform';
import { Scene, SceneLayer } from '@core/game/Scene';

const RenderNode = defineNode({
    display: Display,
    transform: Transform,
}, 'RenderNode');

type RenderNode = InstanceType<typeof RenderNode>;

export class RenderSystem extends System {
    private renderNodes: NodeList<RenderNode> | null = null;
    
    public constructor(private scene: Scene) {
        super();
    }

    public addToEngine(engine: Engine): void {
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

        this.scene.removeAll(SceneLayer.World);

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
        this.scene.addChild(view, layer);
    }

    private removeFromDisplay(node: RenderNode): void {
        const { view, layer } = node.display;
        this.scene.removeChild(view, layer);
    }

    // TODO: Improve logic. Use from playbleads
    private onResize(): void {
        for (let node = this.renderNodes.head; node; node = node.next) {
            const { display } = node;
            display.resize();
        }
    }
}