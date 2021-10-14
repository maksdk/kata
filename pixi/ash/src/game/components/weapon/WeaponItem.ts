import { WeaponType } from '@core/game/constants';

export class WeaponItem {
    public readonly type: WeaponType;

    public constructor(props: { type: WeaponType }) {
        this.type = props.type;
    }
}