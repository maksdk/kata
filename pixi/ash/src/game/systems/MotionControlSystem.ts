import { System, Engine, NodeList, defineNode } from '@ash.ts/ash';
import { InputMotion } from '@core/game/components/InputMotion';
import { RigidBody } from '@core/game/components/RigidBody';
import { Transform } from '@core/game/components/Transform';
import { InputController } from '@core/game/InputController';
import { Vector } from '@core/game/math/Vector';

const InputMotionNode = defineNode({
    transform: Transform,
    rigidbody: RigidBody,
    inputMotion: InputMotion,
}, 'InputMotionNode');
type InputMotionNode = InstanceType<typeof InputMotionNode>;


export class MotionControlSystem extends System {
    private motions: NodeList<InputMotionNode>;

    public constructor(private input: InputController) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.motions = engine.getNodeList(InputMotionNode);
    }

    public removeFromEngine(engine: Engine): void {
        this.motions = null;
    }

    public update(dt: number): void {
        if (!this.motions.head) {
            return;
        }

        const move = this.input.getMove();
        if (move) {
            const { angle, direction } = move;
            for (let node = this.motions.head; node; node = node.next) {
                const { rigidbody } = node;
                rigidbody.velocity = direction;
                rigidbody.angle = angle;
            }
        } else {
            for (let node = this.motions.head; node; node = node.next) {
                const { rigidbody } = node;
                rigidbody.velocity = new Vector(0, 0);
            }
        }
    }
}