import { EntityStateMachine } from '@ash.ts/ash';

// TODO: Think about it more. See matter filter groups
export enum CharacterGroup {
    Singleton = -1,
    Player = 0,
    Enemy = 1,
}

interface ICharacterOptions {
    fsm?: EntityStateMachine | null;
    group?: CharacterGroup;
    id: string;
}

const defaultOptions: ICharacterOptions = {
    fsm: null,
    group: CharacterGroup.Singleton,
    id: 'unknown',
};

export class Character {
    private options: ICharacterOptions;

    public constructor(options: ICharacterOptions) {
        this.options = {
            ...defaultOptions,
            ...options
        };
    }

    public get fsm(): EntityStateMachine | null {
        return this.options.fsm;
    }

    public get group(): CharacterGroup {
        return this.options.group;
    }

    public get id(): string {
        return this.options.id;
    }

    public isEnemy(group: CharacterGroup): boolean {
        if (group < 0 || this.group < 0) {
            return true;
        }

        if (this.group !== group) {
            return true;
        }

        return false;
    }
}