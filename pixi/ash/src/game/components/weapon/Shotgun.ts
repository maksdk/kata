import { BaseWeapon } from '@core/game/components/weapon/BaseWeapon';

export class Shotgun extends BaseWeapon {
    public readonly minShotInterval = 2;
    public timeSinceLastShot = 0;
    public recoilPower = 5;
}