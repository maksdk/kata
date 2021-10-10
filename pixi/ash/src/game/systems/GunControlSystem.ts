import { ListIteratingSystem } from '@ash.ts/ash';
import { EntityCreator } from '@core/game/EntityCreator';
import { GunControlNode } from '@core/game/nodes';

export class GunControlSystem extends ListIteratingSystem<GunControlNode> {
    public constructor(private creator: EntityCreator) {
        super(GunControlNode);
    }

    public updateNode(node: GunControlNode, dt: number): void {
        const { gun, transform } = node;

        gun.timeSinceLastShot += dt;

        if (gun.timeSinceLastShot >= gun.minShotInterval) {
            this.creator.createBullet(
                { x: transform.x, y: transform.y }, 
                { x: Math.cos(transform.rotation), y: Math.sin(transform.rotation) }
            );
            gun.timeSinceLastShot = 0;
        }
    }
} 