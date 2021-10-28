import { defineNode, Engine, NodeList, System } from '@ash.ts/ash';
import { Bullet } from '@core/game/components/Bullet';
import { Collided } from '@core/game/components/Collided';
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


const CollidedBulletNode = defineNode({
    bullet: Bullet,
    collided: Collided,
    rigidbody: RigidBody,
}, 'CollidedBulletNode');

type CollidedBulletNode = InstanceType<typeof CollidedBulletNode>;

export class BulletSystem extends System {
    private bullets: NodeList<BulletNode> | null = null;
    private collidedBullets: NodeList<CollidedBulletNode> | null = null;

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

        this.collidedBullets = engine.getNodeList(CollidedBulletNode);
        this.collidedBullets.nodeAdded.add((node) => this.addCollidedBullet(node));
    }

    public removeFromEngine(): void {
        this.bullets = null;
    }

    private addBullet(node: BulletNode): void {
        const { rigidbody, transform } = node;
        rigidbody.body.setPosition(transform.x, transform.y);
    }

    private removeBullet(node: BulletNode | CollidedBulletNode): void {
        const { rigidbody } = node;
        rigidbody.remove();
    }

    private addCollidedBullet(node: CollidedBulletNode): void {
        node.entity.add(new RemoveEntity());
    }

    public update(dt: number): void {
        for (let node = this.bullets.head; node; node = node.next) {
            const { rigidbody, transform } = node;
            rigidbody.velocity = new Vector(1, 0);
            rigidbody.angle = 0;
        }
    }
}