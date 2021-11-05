import { WeaponType } from '@core/game/constants';

export class Shotgun {
    public static readonly type: WeaponType = WeaponType.Shotgun;
    public readonly minShotInterval = 1;
    public timeSinceLastShot = 0;
}