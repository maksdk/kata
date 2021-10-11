import { System, NodeList, Engine, Entity } from '@ash.ts/ash';
import { Transform } from '@core/game/components/Transform';
import { EntityCreator } from '@core/game/EntityCreator';
import { CollisionNode, TriggerZoneNode } from '@core/game/nodes';

export class DebugSystem extends System {
    private collisionNodes: NodeList<CollisionNode>;
    private triggerNodes: NodeList<TriggerZoneNode>;
    private shapes: Map<CollisionNode | TriggerZoneNode, Entity> = new Map();

    public constructor(private creator: EntityCreator) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.collisionNodes = engine.getNodeList(CollisionNode);
        this.triggerNodes = engine.getNodeList(TriggerZoneNode);

        for (let node = this.collisionNodes.head; node; node = node.next) {
            this.drawCollisionShape(node);
        }

        for (let node = this.triggerNodes.head; node; node = node.next) {
            this.drawTriggerShape(node);
        }

        this.collisionNodes.nodeAdded.add((node) => this.drawCollisionShape(node));
        this.collisionNodes.nodeRemoved.add((node) => this.removeCollisionShape(node));

        this.triggerNodes.nodeAdded.add((node) => this.drawTriggerShape(node));
        this.triggerNodes.nodeRemoved.add((node) => this.removeCollisionShape(node));
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
        const { collision } = node;
        const entity = this.creator.createDebugCollisionShape({
            type: collision.type,
            polygon: collision.polygon,
            radius: collision.radius,
        });

        this.shapes.set(node, entity);
    }

    private drawTriggerShape(node: TriggerZoneNode): void {
        const { trigger } = node;

        const entity = this.creator.createDebugCollisionShape({
            type: trigger.type,
            polygon: trigger.polygon,
            radius: trigger.radius,
        });

        this.shapes.set(node, entity);
    }

    private removeCollisionShape(node: CollisionNode | TriggerZoneNode): void {
        if (this.shapes.has(node)) {
            const entity = this.shapes.get(node);
            this.creator.removeEntity(entity);
            this.shapes.delete(node);
        }
    }
}