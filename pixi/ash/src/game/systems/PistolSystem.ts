import { RigidBody } from '../components/RigidBody';
import { defineNode, Engine, NodeList, System } from '@ash.ts/ash';
import { Character } from '@core/game/components/Character';
import { Transform } from '@core/game/components/Transform';
import { Pistol } from '@core/game/components/Pistol';
import { World } from '@core/game/World';
import { Vector } from '@core/game/math/Vector';
import { Shooting } from '@core/game/components/Shooting';

const PistolNode = defineNode({
    pistol: Pistol,
    shooting: Shooting,
    rigidbody: RigidBody,
    transform: Transform,
}, 'PistolNode');

type PistolNode = InstanceType<typeof PistolNode>;

const TargetNode = defineNode({
    transform: Transform,
    character: Character,
}, 'TargetNode');

type TargetNode = InstanceType<typeof TargetNode>;

export class PistolSystem extends System {
    private targets: NodeList<TargetNode> | null;
    private pistols: NodeList<PistolNode> | null;

    public constructor(private world: World) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.targets = engine.getNodeList(TargetNode);
        this.pistols = engine.getNodeList(PistolNode);
    }

    public removeFromEngine(engine: Engine): void {
        this.targets = null;
        this.pistols = null;
    }

    public update(dt: number): void {
        if (!this.targets.head) {
            return;
        }
        
        for (let pistol = this.pistols.head; pistol; pistol = pistol.next) {

            pistol.pistol.timeSinceLastShot += dt;
            
            if (pistol.pistol.timeSinceLastShot >= pistol.pistol.minShotInterval) {
                const target = this.findNearestTarget(pistol);
                if (target) {
                    const dir = Vector.sub2(
                        new Vector(target.transform.x, target.transform.y),
                        new Vector(pistol.transform.x, pistol.transform.y)
                    ).normalize();
        
                    const pos = {
                        x: pistol.transform.x + dir.x * pistol.transform.maxWidth,
                        y: pistol.transform.y + dir.y * pistol.transform.maxHeight
                    };
        
                    this.world.createBullet(new Vector(pos.x, pos.y), {
                        velocity: dir,
                    });

                    pistol.pistol.timeSinceLastShot = 0;
                    pistol.rigidbody.angle = dir.getAngle();
                }
            }
        }
    }

    private findNearestTarget(pistol: PistolNode): TargetNode | null {
        let minDist = Infinity;
        let currentTarget: TargetNode | null = null;

        for (let target = this.targets.head; target; target = target.next) {
            if (pistol.entity === target.entity) {
                continue;
            }

            const currentDist = Vector.distance(
                new Vector(pistol.transform.x, pistol.transform.y),
                new Vector(target.transform.x, target.transform.y)
            );

            if (currentDist < minDist) {
                minDist = currentDist;
                currentTarget = target;
            }
        }

        return currentTarget;
    }
} 