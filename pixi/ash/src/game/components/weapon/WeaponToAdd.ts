import { WeaponType } from '@core/game/constants';

export class WeaponToAdd {
    public readonly type: WeaponType;

    public constructor(props: { type: WeaponType }) {
        this.type = props.type;
    }
}