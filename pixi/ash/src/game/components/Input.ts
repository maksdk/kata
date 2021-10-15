import { EntityStateMachine } from '@ash.ts/ash';

export class Input {
    public constructor(public readonly fsm: EntityStateMachine) {}
}