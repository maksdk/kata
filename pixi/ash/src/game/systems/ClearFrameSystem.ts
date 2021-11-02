import { defineNode, ListIteratingSystem } from '@ash.ts/ash';
import { RemoveEntity } from '@core/game/components/RemoveEntity';
import { World } from '@core/game/World';

const ClearSystemNode = defineNode({
    remove: RemoveEntity,
}, 'ClearSystem');

type ClearSystemNode = InstanceType<typeof ClearSystemNode>;

export class ClearFrameSystem extends ListIteratingSystem<ClearSystemNode> {
    public constructor(private world: World) {
        super(ClearSystemNode);
    }

    public updateNode(node: ClearSystemNode): void {
        this.world.removeEntity(node.entity);
    }
}