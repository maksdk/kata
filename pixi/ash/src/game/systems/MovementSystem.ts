import { ListIteratingSystem } from '@ash.ts/ash';
import { MovementNode } from '@core/game/nodes';

export class MovementSystem extends ListIteratingSystem<MovementNode> {
    public constructor() {
        super(MovementNode);
    }

    public updateNode(node: MovementNode, dt: number): void {
        const { transform, motion } = node;
        const { velocity, rotation, moveSpeed } = motion;
        const speed = moveSpeed * dt;
        transform.x += velocity.x * speed;
        transform.y += velocity.y * speed;
        transform.rotation = rotation;
    }
}