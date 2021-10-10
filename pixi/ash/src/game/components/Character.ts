import { EntityStateMachine } from '@ash.ts/ash';

export class Character {
    public constructor(public fsm: EntityStateMachine) {}
}