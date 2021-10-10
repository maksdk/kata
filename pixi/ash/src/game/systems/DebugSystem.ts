import { System, NodeList, Engine, Entity } from '@ash.ts/ash';
import { Transform } from '@core/game/components/Transform';
import { EntityCreator } from '@core/game/EntityCreator';
import { CollisionNode } from '@core/game/nodes';

export class DebugSystem extends System {
    private collisionNodes: NodeList<CollisionNode>;
    private shapes: Map<CollisionNode, Entity> = new Map();

    public constructor(private creator: EntityCreator) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.collisionNodes = engine.getNodeList(CollisionNode);

        for (let node = this.collisionNodes.head; node; node = node.next) {
            this.drawCollisionShape(node);
        }

        this.collisionNodes.nodeAdded.add((node) => this.drawCollisionShape(node));
        this.collisionNodes.nodeRemoved.add((node) => this.removeCollisionShape(node));
    }

    public removeFromEngine(): void {
        //
    }

    public update(dt: number): void {
        this.shapes.forEach((entity, node) => {
            const transform = entity.get(Transform);
            transform.x = node.transform.x;
            transform.y = node.transform.y;
            transform.rotation = node.transform.rotation;
            transform.sx = node.transform.sx;
            transform.sy = node.transform.sy;
        });
    }

    private drawCollisionShape(node: CollisionNode): void {
        const { transform, collision } = node;
        const entity = this.creator.createDebugCollisionShape({
            transform,
            collision
        });

        this.shapes.set(node, entity);
    }

    private removeCollisionShape(node: CollisionNode): void {
        if (this.shapes.has(node)) {
            const entity = this.shapes.get(node);
            this.creator.removeEntity(entity);
            this.shapes.delete(node);
        }
    }
}