import { System, Engine, NodeList, defineNode } from '@ash.ts/ash';
import { Character } from '@core/game/components/Character';
import { Input } from '@core/game/components/Input';
import { InputControl } from '@core/game/components/InputControl';
import { RigidBody } from '@core/game/components/RigidBody';
import { Transform } from '@core/game/components/Transform';
import { Vector } from '@core/game/math/Vector';

const InputControlNode = defineNode({
    control: InputControl,
    input: Input,
}, 'InputControlNode');
type InputControlNode = InstanceType<typeof InputControlNode>;

const MotionNode = defineNode({
    transform: Transform,
    rigidbody: RigidBody,
    character: Character,
}, 'MotionNode');
type MotionNode = InstanceType<typeof MotionNode>;


export class MotionControlSystem extends System {
    private inputNodes: NodeList<InputControlNode>;
    private motionNodes: NodeList<MotionNode>;

    public constructor() {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.motionNodes = engine.getNodeList(MotionNode);
        this.inputNodes = engine.getNodeList(InputControlNode);
    }

    public removeFromEngine(engine: Engine): void {
        this.motionNodes = null;
        this.inputNodes = null;
    }

    public update(dt: number): void {
        const inputNode = this.inputNodes.head;

        if (inputNode) {
            const { control } = inputNode;
            if (control.pointer) {
                const { position } = control.pointer;
                for (let node = this.motionNodes.head; node; node = node.next) {
                    const { rigidbody, transform } = node;
                    const dir = position.sub(new Vector(transform.x, transform.y)).normalize();
                    rigidbody.velocity = dir;
                    rigidbody.angle = Math.atan2(dir.y, dir.x);
                }
            } else {
                for (let node = this.motionNodes.head; node; node = node.next) {
                    const { rigidbody } = node;
                    rigidbody.velocity = new Vector();
                }
            }
        }
    }
}