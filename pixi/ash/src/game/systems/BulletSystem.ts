import { defineNode, Engine, NodeList, System } from '@ash.ts/ash';
import { Bullet } from '@core/game/components/Bullet';
import { CollisionStart } from '@core/game/components/CollisionStart';
import { RemoveEntity } from '@core/game/components/RemoveEntity';
import { RigidBody } from '@core/game/components/RigidBody';
import { Transform } from '@core/game/components/Transform';
import { Game } from '@core/game/Game';
import { Vector } from '@core/game/math/Vector';

const BulletNode = defineNode({
    bullet: Bullet,
    rigidbody: RigidBody,
    transform: Transform,
}, 'BulletNode');

type BulletNode = InstanceType<typeof BulletNode>;


const CollisionStartBulletNode = defineNode({
    bullet: Bullet,
    collision: CollisionStart,
    rigidbody: RigidBody,
}, 'CollisionStartBulletNode');

type CollisionStartBulletNode = InstanceType<typeof CollisionStartBulletNode>;

export class BulletSystem extends System {
    private bullets: NodeList<BulletNode> | null = null;
    private collidedBullets: NodeList<CollisionStartBulletNode> | null = null;

    public constructor(private game: Game) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.bullets = engine.getNodeList(BulletNode);

        for (let node = this.bullets.head; node; node = node.next) {
            this.addBullet(node);
        }

        this.bullets.nodeAdded.add((node) => this.addBullet(node));
        this.bullets.nodeRemoved.add((node) => this.removeBullet(node));

        this.collidedBullets = engine.getNodeList(CollisionStartBulletNode);
        this.collidedBullets.nodeAdded.add((node) => this.onStartCollisionBullet(node));
    }

    public removeFromEngine(): void {
        this.bullets = null;
    }

    private addBullet(node: BulletNode): void {
        const { rigidbody, transform } = node;
        rigidbody.body.setPosition(transform.x, transform.y);
    }

    private removeBullet(node: BulletNode | CollisionStartBulletNode): void {
        const { rigidbody } = node;
        rigidbody.remove();
    }

    private onStartCollisionBullet(node: CollisionStartBulletNode): void {
        const { collision } = node;

        collision.collision.pairs.forEach(pair => {
            pair.activeContacts.forEach(contact => {
                this.game.entityCreator.createBuckshotBullet(
                    new Vector(contact.x, contact.y),
                    new Vector(1, 0)
                );
            });
        });

        node.entity.add(new RemoveEntity());
    }

    public update(dt: number): void {
        //
    }
}