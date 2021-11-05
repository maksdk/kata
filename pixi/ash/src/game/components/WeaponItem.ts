import { WeaponType } from '@core/game/constants';

export class WeaponItem {
    public constructor(private options: { type: WeaponType }) {}

    public get type():WeaponType {
        return this.options.type;
    }
}