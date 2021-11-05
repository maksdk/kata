import { RigidBody } from './../components/RigidBody';
import { defineNode, Engine, NodeList, System } from '@ash.ts/ash';
import { Character } from '@core/game/components/Character';
import { Transform } from '@core/game/components/Transform';
import { World } from '@core/game/World';
import { Vector } from '@core/game/math/Vector';
import { Shooting } from '@core/game/components/Shooting';
import { Shotgun } from '@core/game/components/Shotgun';

const ShotgunNode = defineNode({
    shotgun: Shotgun,
    shooting: Shooting,
    rigidbody: RigidBody,
    transform: Transform,
}, 'ShotgunNode');

type ShotgunNode = InstanceType<typeof ShotgunNode>;

const TargetNode = defineNode({
    transform: Transform,
    character: Character,
}, 'TargetNode');

type TargetNode = InstanceType<typeof TargetNode>;

export class ShotgunSystem extends System {
    private targets: NodeList<TargetNode> | null;
    private shotguns: NodeList<ShotgunNode> | null;

    public constructor(private world: World) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.targets = engine.getNodeList(TargetNode);
        this.shotguns = engine.getNodeList(ShotgunNode);
    }

    public removeFromEngine(engine: Engine): void {
        this.targets = null;
        this.shotguns = null;
    }

    public update(dt: number): void {
        if (!this.targets.head) {
            return;
        }
        
        for (let shotgun = this.shotguns.head; shotgun; shotgun = shotgun.next) {

            shotgun.shotgun.timeSinceLastShot += dt;
            
            if (shotgun.shotgun.timeSinceLastShot >= shotgun.shotgun.minShotInterval) {
                const target = this.findNearestTarget(shotgun);
                if (target) {
                    const dir = Vector.sub2(
                        new Vector(target.transform.x, target.transform.y),
                        new Vector(shotgun.transform.x, shotgun.transform.y)
                    ).normalize();
        
                    const pos = {
                        x: shotgun.transform.x + dir.x * shotgun.transform.maxWidth,
                        y: shotgun.transform.y + dir.y * shotgun.transform.maxHeight
                    };
        
                    this.world.createBuckshotBullet(new Vector(pos.x, pos.y), {
                        velocity: dir
                    });

                    shotgun.shotgun.timeSinceLastShot = 0;
        
                    shotgun.rigidbody.angle = dir.getAngle();
                }
            }
        }
    }

    private findNearestTarget(shotgun: ShotgunNode): TargetNode | null {
        let minDist = Infinity;
        let currentTarget: TargetNode | null = null;

        for (let target = this.targets.head; target; target = target.next) {
            if (shotgun.entity === target.entity) {
                continue;
            }

            const currentDist = Vector.distance(
                new Vector(shotgun.transform.x, shotgun.transform.y),
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