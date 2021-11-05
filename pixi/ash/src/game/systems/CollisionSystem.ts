import { defineNode, Engine, NodeList, System } from '@ash.ts/ash';
import { CollisionStart } from '@core/game/components/CollisionStart';
import { CollisionEnd } from '@core/game/components/CollisionEnd';
import { RigidBody } from '@core/game/components/RigidBody';
import { Transform } from '@core/game/components/Transform';
import { IPhysicsCollision, Physics } from '@core/game/math/Physics';

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

        this.physics.on('collisionstart', this.onStartCollision, this);
        this.physics.on('collisionend', this.onEndCollision, this);
    }

    public removeFromEngine(): void {
        this.nodes.nodeAdded.remove((node) => this.addNode(node));
        this.nodes.nodeRemoved.remove((node) => this.removeNode(node));
        this.nodes = null;

        this.physics.off('collisionstart', this.onStartCollision, this);
        this.physics.off('collisionend', this.onEndCollision, this);
    }

    private addNode(node: CollisionNode): void {
        const { rigidbody, transform } = node;
        rigidbody.body.setPosition(transform.x, transform.y);
    }

    private removeNode(node: CollisionNode): void {
        const { rigidbody } = node;
        rigidbody.remove();
    }

    private onStartCollision(event: IPhysicsCollision): void {
        const { pairs } = event;
        // TODO: Bad decision. Think more about it.
        pairs.forEach((elem) => {
            const { bodyA, bodyB } = elem;
            for (let node = this.nodes.head; node; node = node.next) {
                const { rigidbody } = node;
                if (rigidbody.body.id === bodyA.id || rigidbody.body.id === bodyB.id) {
                    node.entity.add(new CollisionStart(event));
                }
            }
        });
    }

    private onEndCollision(event: IPhysicsCollision): void {
        const { pairs } = event;

        // TODO: Bad decision. Think more about it.
        pairs.forEach((elem) => {
            const { bodyA, bodyB } = elem;
            for (let node = this.nodes.head; node; node = node.next) {
                const { rigidbody } = node;
                if (rigidbody.body.id === bodyA.id || rigidbody.body.id === bodyB.id) {
                    node.entity.add(new CollisionEnd(event));
                }
            }
        });
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