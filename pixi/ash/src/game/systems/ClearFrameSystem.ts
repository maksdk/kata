import { defineNode, ListIteratingSystem } from '@ash.ts/ash';
import { RemoveEntity } from '@core/game/components/RemoveEntity';
import { Game } from '@core/game/Game';

const ClearSystemNode = defineNode({
    remove: RemoveEntity,
}, 'ClearSystem');

type ClearSystemNode = InstanceType<typeof ClearSystemNode>;

export class ClearFrameSystem extends ListIteratingSystem<ClearSystemNode> {
    public constructor(private game: Game) {
        super(ClearSystemNode);
    }

    public updateNode(node: ClearSystemNode): void {
        this.game.entityCreator.removeEntity(node.entity);
    }
}