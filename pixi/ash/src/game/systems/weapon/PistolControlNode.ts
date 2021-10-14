import { ListIteratingSystem } from '@ash.ts/ash';
import { EntityCreator } from '@core/game/EntityCreator';
import { Vector } from '@core/game/math/Vector';
import { PistolControlNode } from '@core/game/nodes';

export class PistolControlSystem extends ListIteratingSystem<PistolControlNode> {
    public constructor(private creator: EntityCreator) {
        super(PistolControlNode);
    }

    public updateNode(node: PistolControlNode, dt: number): void {
        const { pistol, transform } = node;

        pistol.timeSinceLastShot += dt;

        if (pistol.timeSinceLastShot >= pistol.minShotInterval) {
            this.creator.createBullet(
                new Vector(transform.x, transform.y),
                new Vector(Math.cos(transform.rotation), Math.sin(transform.rotation))
            );
            pistol.timeSinceLastShot = 0;
        }
    }
} 