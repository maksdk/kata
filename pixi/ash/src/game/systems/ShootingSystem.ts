import { System, Engine, NodeList, defineNode } from '@ash.ts/ash';
import { RigidBody } from '@core/game/components/RigidBody';
import { Shooting } from '@core/game/components/Shooting';
import { Transform } from '@core/game/components/Transform';
import { Vector } from '@core/game/math/Vector';

const ShootingNode = defineNode({
    transform: Transform,
    rigidbody: RigidBody,
    shooting: Shooting,
}, 'ShootingNode');
type ShootingNode = InstanceType<typeof ShootingNode>;


export class ShootingSystem extends System {
    private nodes: NodeList<ShootingNode>;

    public constructor() {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.nodes = engine.getNodeList(ShootingNode);

        for (let node = this.nodes.head; node; node = node.next) {
           this.addNode(node);
        }

        this.nodes.nodeAdded.add((node) => this.addNode(node));
    }

    public removeFromEngine(engine: Engine): void {
        this.nodes = null;
        this.nodes.nodeAdded.remove((node) => this.addNode(node));
    }

    public update(dt: number): void {
        if (!this.nodes.head) {
            return;
        }

        console.log('shooting');
    }

    private addNode(node: ShootingNode): void {
        const { rigidbody } = node;
        rigidbody.velocity = new Vector(0, 0);
    }
}