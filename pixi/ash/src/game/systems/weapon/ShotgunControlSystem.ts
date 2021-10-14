import { ListIteratingSystem } from '@ash.ts/ash';
import { EntityCreator } from '@core/game/EntityCreator';
import { Vector } from '@core/game/math/Vector';
import { ShotgunControlNode } from '@core/game/nodes';

export class ShotgunControlSystem extends ListIteratingSystem<ShotgunControlNode> {
    public constructor(private creator: EntityCreator) {
        super(ShotgunControlNode);
    }

    public updateNode(node: ShotgunControlNode, dt: number): void {
        const { shotgun, transform, motion } = node;

        shotgun.timeSinceLastShot += dt;

        if (shotgun.timeSinceLastShot >= shotgun.minShotInterval) {
            const direction = new Vector(Math.cos(transform.rotation), Math.sin(transform.rotation));
            this.creator.createBuckshotBullet(
                new Vector(transform.x, transform.y),
                direction
            );
            shotgun.timeSinceLastShot = 0;

            motion.velocity = direction.mulScalar(-shotgun.recoilPower);
        }
    }
} 