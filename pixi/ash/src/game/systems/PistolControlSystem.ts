import { defineNode, ListIteratingSystem } from '@ash.ts/ash';
import { Transform } from '@core/game/components/Transform';
import { Pistol } from '@core/game/components/weapon/Pistol';
import { EntityCreator } from '@core/game/EntityCreator';
import { Vector } from '@core/game/math/Vector';

const PistolControlNode = defineNode({
    pistol: Pistol,
    transform: Transform,
}, 'PistolControlNode');

type PistolControlNode = InstanceType<typeof PistolControlNode>;

export class PistolControlSystem extends ListIteratingSystem<PistolControlNode> {
    public constructor(private creator: EntityCreator) {
        super(PistolControlNode);
    }

    public updateNode(node: PistolControlNode, dt: number): void {
        const { pistol, transform } = node;

        pistol.timeSinceLastShot += dt;

        if (pistol.timeSinceLastShot >= pistol.minShotInterval) {
            const speed = 8;

            const dir = {
                x: Math.cos(transform.rotation), 
                y: Math.sin(transform.rotation),
            };

            const pos = {
                x: transform.x + dir.x * transform.maxWidth,
                y: transform.y + dir.y * transform.maxHeight
            };

            this.creator.createBullet(new Vector(pos.x, pos.y), {
                velocity: {
                    x: dir.x * speed, 
                    y: dir.y * speed,
                },
                radius: 6,
                friction: 0,
                frictionAir: 0,
                //TODO: Avoid collisions between bullets 
                collisionFilter: {
                    group: -100,
                }
            });
            pistol.timeSinceLastShot = 0;
        }
    }
} 