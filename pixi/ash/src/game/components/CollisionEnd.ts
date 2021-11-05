import { IPhysicsCollision } from '@core/game/math/Physics';

export class CollisionEnd {
    public constructor(public readonly collision: IPhysicsCollision) {}
}