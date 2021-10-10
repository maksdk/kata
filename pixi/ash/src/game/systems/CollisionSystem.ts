import { Vector } from '@core/game/math/Vector';
import { Engine, System, NodeList } from '@ash.ts/ash';
import { pointInRect } from '@core/game/math/collision';
import { CollisionBulletNode, CollisionWallNode } from '@core/game/nodes';
import { EntityCreator } from '@core/game/EntityCreator';

// TODO: Needs a lot of optimization

export class CollisionSystem extends System {
    private bulletNodes: NodeList<CollisionBulletNode>;
    private wallNodes: NodeList<CollisionWallNode>;

    public constructor(private creator: EntityCreator) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.bulletNodes = engine.getNodeList(CollisionBulletNode);
        this.wallNodes = engine.getNodeList(CollisionWallNode);
    }

    public removeFromEngine(): void {
        //
    }

    public update(dt: number): void {
        if (this.wallNodes.head && this.bulletNodes.head) {
            for (let wallNode = this.wallNodes.head; wallNode; wallNode = wallNode.next) {

                for (let bulletNode = this.bulletNodes.head; bulletNode; bulletNode = bulletNode.next) {

                    const bulletPoint = new Vector(bulletNode.transform.x, bulletNode.transform.y);

                    const rect = {
                        x: wallNode.transform.x,
                        y: wallNode.transform.y,
                        width: wallNode.collision.width,
                        height: wallNode.collision.height,
                        originX: wallNode.collision.origin.x,
                        originY: wallNode.collision.origin.y,
                    };

                    const intersect = pointInRect(bulletPoint, rect);
                    if (intersect) {
                        this.creator.removeEntity(bulletNode.entity);
                    }
                } 
            }
        }
    }
}