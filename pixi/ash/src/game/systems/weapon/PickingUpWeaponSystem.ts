import { PickingUpWeaponItemNode, PickingUpWeaponCharacterNode } from '@game/nodes';
import { Engine, NodeList, System } from '@ash.ts/ash';
import { Vector } from '@core/game/math/Vector';
import { pointInRect } from '@core/game/math/collision';
import { EntityCreator } from '@core/game/EntityCreator';
import { WeaponToAdd } from '@core/game/components/weapon/WeaponToAdd';

export class PickingUpWeaponSystem extends System {
    private items: NodeList<PickingUpWeaponItemNode> | null = null;
    private characters: NodeList<PickingUpWeaponCharacterNode> | null = null;

    public constructor(private creator: EntityCreator) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.items = engine.getNodeList(PickingUpWeaponItemNode);
        this.characters = engine.getNodeList(PickingUpWeaponCharacterNode);
    }

    public removeFromEngine(): void {
        this.items = null;
        this.characters = null;
    }

    public update(): void {
        if (!this.items || !this.characters) {
            return;
        }

        for (let itemNode = this.items.head; itemNode; itemNode = itemNode.next) {
            for (let characterNode = this.characters.head; characterNode; characterNode = characterNode.next) {
                const x = characterNode.transform.x;
                const y = characterNode.transform.y;
                const characterPos = new Vector(x, y);

                const itemTriggerRect = {
                    x: itemNode.transform.x,
                    y: itemNode.transform.y,
                    width: itemNode.trigger.width,
                    height: itemNode.trigger.height,
                    originX: itemNode.trigger.origin.x,
                    originY: itemNode.trigger.origin.y,
                };
                const intersect = pointInRect(characterPos, itemTriggerRect);
                if (intersect) {
                    this.creator.removeEntity(itemNode.entity);
                    characterNode.entity.add(new WeaponToAdd({ type: itemNode.item.type }));
                }
            }
        }
    }
}