import { defineNode, Engine, NodeList, System } from '@ash.ts/ash';
import { RigidBody } from '@core/game/components/RigidBody';
import { Transform } from '@core/game/components/Transform';
import { Physics } from '@core/game/math/Physics';

const CollisionNode = defineNode({
    transform: Transform,
    rigidbody: RigidBody,
}, 'CollisionNode');

type CollisionNode = InstanceType<typeof CollisionNode>;

export class CollisionSystem extends System {
    private nodes: NodeList<CollisionNode> | null = null;

    public constructor(private physics: Physics) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.nodes = engine.getNodeList(CollisionNode);

        for (let node = this.nodes.head; node; node = node.next) {
            this.addNode(node);
        }

        this.nodes.nodeAdded.add((node) => this.addNode(node));
        this.nodes.nodeRemoved.add((node) => this.removeNode(node));
    }

    public removeFromEngine(): void {
        this.nodes = null;
    }

    private addNode(node: CollisionNode): void {
        const { rigidbody, transform } = node;
        rigidbody.body.setPosition(transform.x, transform.y);
    }

    private removeNode(node: CollisionNode): void {
        const { rigidbody } = node;
        rigidbody.remove();
    }

    public update( dt: number): void {
        this.physics.update(dt);

        for (let node = this.nodes.head; node; node = node.next) {
            const { rigidbody, transform } = node;
            if (rigidbody.isDynamic) {
                transform.x = rigidbody.body.position.x;
                transform.y = rigidbody.body.position.y;
                transform.rotation = rigidbody.body.rotation;
            }
        }
    }
}