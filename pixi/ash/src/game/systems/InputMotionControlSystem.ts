import { System, Engine, NodeList, defineNode } from '@ash.ts/ash';
import { Input } from '@core/game/components/Input';
import { InputControl } from '@core/game/components/InputControl';
import { InputMotion } from '@core/game/components/InputMotion';
import { RigidBody } from '@core/game/components/RigidBody';
import { Transform } from '@core/game/components/Transform';
import { Vector } from '@core/game/math/Vector';

const InputControlNode = defineNode({
    control: InputControl,
    input: Input,
}, 'InputControlNode');
type InputControlNode = InstanceType<typeof InputControlNode>;

const InputMotionNode = defineNode({
    transform: Transform,
    rigidbody: RigidBody,
    inputMotion: InputMotion,
}, 'InputMotionNode');
type InputMotionNode = InstanceType<typeof InputMotionNode>;


export class InputMotionControlSystem extends System {
    private inputNodes: NodeList<InputControlNode>;
    private inputMotionNodes: NodeList<InputMotionNode>;

    public constructor() {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.inputMotionNodes = engine.getNodeList(InputMotionNode);
        this.inputNodes = engine.getNodeList(InputControlNode);
    }

    public removeFromEngine(engine: Engine): void {
        this.inputMotionNodes = null;
        this.inputNodes = null;
    }

    public update(dt: number): void {
        const inputNode = this.inputNodes.head;

        if (inputNode) {
            const { control } = inputNode;
            const input = control.useInput();
            if (input) {
                const { angle, direction, type } = input;
                for (let node = this.inputMotionNodes.head; node; node = node.next) {
                    const { rigidbody } = node;
                    rigidbody.velocity = type === 'stop' ? new Vector(0, 0) : direction;
                    rigidbody.angle = angle;
                }
            }
        }
    }
}