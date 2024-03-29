import { WeaponType } from '@core/game/constants';

export class Pistol {
    public static readonly type: WeaponType = WeaponType.Pistol;
    public readonly minShotInterval = 1;
    public timeSinceLastShot = 0;
}