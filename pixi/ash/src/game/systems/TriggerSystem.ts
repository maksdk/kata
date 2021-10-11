import { Vector } from '@core/game/math/Vector';
import { Engine, System, NodeList } from '@ash.ts/ash';
import { pointInRect } from '@core/game/math/collision';
import { TriggerTargetNode, TriggerZoneNode } from '@core/game/nodes';
import { EntityCreator } from '@core/game/EntityCreator';

// TODO: Needs a lot of optimization

export class TriggerSystem extends System {
    private targetNodes: NodeList<TriggerTargetNode>;
    private triggerNodes: NodeList<TriggerZoneNode>;

    public constructor(private creator: EntityCreator) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.targetNodes = engine.getNodeList(TriggerTargetNode);
        this.triggerNodes = engine.getNodeList(TriggerZoneNode);
    }

    public removeFromEngine(): void {
        //
    }

    public update(dt: number): void {
        for (let triggerNode = this.triggerNodes.head; triggerNode; triggerNode = triggerNode.next) {
            for (let targetNode = this.targetNodes.head; targetNode; targetNode = targetNode.next) {

                const bulletPoint = new Vector(targetNode.transform.x, targetNode.transform.y);

                const rect = {
                    x: triggerNode.transform.x,
                    y: triggerNode.transform.y,
                    width: triggerNode.trigger.width,
                    height: triggerNode.trigger.height,
                    originX: triggerNode.trigger.origin.x,
                    originY: triggerNode.trigger.origin.y,
                };

                const intersect = pointInRect(bulletPoint, rect);
                if (intersect && !targetNode.triggerTarget.isEntered) {
                    targetNode.triggerTarget.isEntered = true;
                    targetNode.character.fsm.changeState('red');
                } else if (!intersect && targetNode.triggerTarget.isEntered) {
                    targetNode.triggerTarget.isEntered = false;
                    targetNode.character.fsm.changeState('white');
                }
            } 
        }
    }
}   