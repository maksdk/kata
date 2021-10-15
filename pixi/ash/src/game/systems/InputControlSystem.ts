import { System, Engine, NodeList } from '@ash.ts/ash';
import { Vector } from '@core/game/math/Vector';
import { InputControlNode, MotionControlNode } from '@core/game/nodes';

export class InputControlSystem extends System {
    private inputNodes: NodeList<InputControlNode>;
    private motionNodes: NodeList<MotionControlNode>;

    public constructor() {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.motionNodes = engine.getNodeList(MotionControlNode);
        this.inputNodes = engine.getNodeList(InputControlNode);
    }

    public removeFromEngine(engine: Engine): void {
        // reset all
    }

    public update(dt: number): void {
        const inputNode = this.inputNodes.head;
        const motionNode = this.motionNodes.head;


        if (inputNode) {
            const { input, control } = inputNode;

            // Hide input if there is not motionable entities
            if (!motionNode) {
                input.fsm.changeState('disabled');
            } else {
                input.fsm.changeState('enabled');
            }

            // Move entities that have motion component
            if (control.pointer) {
                const { position } = control.pointer;
                for (let node = this.motionNodes.head; node; node = node.next) {
                    const { motion, transform } = node;
                    const dir = position.sub(new Vector(transform.x, transform.y)).normalize();
                    motion.velocity = dir;
                    motion.rotation = Math.atan2(dir.y, dir.x);
                }
            } else {
                for (let node = this.motionNodes.head; node; node = node.next) {
                    const { motion } = node;
                    motion.velocity = new Vector();
                }
            }
        }
    }
}