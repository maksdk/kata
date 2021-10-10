import { Engine, ListIteratingSystem, NodeList } from '@ash.ts/ash';
import { InputControl } from '@core/game/components/InputControl';
import { MotionControlNode, InputControlNode } from '@core/game/nodes';

export class MotionControlSystem extends ListIteratingSystem<MotionControlNode> {
    private inputNodes: NodeList<InputControlNode>;

    public constructor() {
        super(MotionControlNode);
    }


    public updateNode(node: MotionControlNode, time: number): void {
        //
    }
} 