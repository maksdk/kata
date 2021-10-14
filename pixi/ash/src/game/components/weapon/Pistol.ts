import { BaseWeapon } from '@core/game/components/weapon/BaseWeapon';

export class Pistol extends BaseWeapon {
    public readonly minShotInterval = 2;
    public timeSinceLastShot = 0;
}