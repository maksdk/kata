import { defineNode, Engine, NodeList, System } from '@ash.ts/ash';
import { CollisionStart } from '@core/game/components/CollisionStart';
import { CollisionEnd } from '@core/game/components/CollisionEnd';
import { RigidBody } from '@core/game/components/RigidBody';
import { Transform } from '@core/game/components/Transform';

const CollisionStartNode = defineNode({
    transform: Transform,
    rigidbody: RigidBody,
    collisioStart: CollisionStart,
}, 'CollisionStartNode');

type CollisionStartNode = InstanceType<typeof CollisionStartNode>;

const CollisionEndNode = defineNode({
    transform: Transform,
    rigidbody: RigidBody,
    collisioEnd: CollisionEnd,
}, 'CollisionEndNode');

type CollisionEndNode = InstanceType<typeof CollisionEndNode>;

export class CollisionClearSystem extends System {
    private collisionStart: NodeList<CollisionStartNode> | null = null;
    private collisionEnd: NodeList<CollisionEndNode> | null = null;

    public addToEngine(engine: Engine): void {
        this.collisionStart = engine.getNodeList(CollisionStartNode);
        this.collisionEnd = engine.getNodeList(CollisionEndNode);
    }

    public removeFromEngine(): void {
        this.collisionStart = null;
        this.collisionEnd = null;
    }

    public update(): void {
        for (let node = this.collisionStart.head; node; node = node.next) {
            node.entity.remove(CollisionStart);
        }

        for (let node = this.collisionEnd.head; node; node = node.next) {
            node.entity.remove(CollisionEnd);
        }
    }
}