import { IPhysicsCollision } from '@core/game/math/Physics';

export class CollisionStart {
    public constructor(public readonly collision: IPhysicsCollision) {}
}