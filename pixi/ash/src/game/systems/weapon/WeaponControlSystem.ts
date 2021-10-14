import { ListIteratingSystem } from '@ash.ts/ash';
import { BaseWeapon } from '@core/game/components/weapon/BaseWeapon';
import { Pistol } from '@core/game/components/weapon/Pistol';
import { Shotgun } from '@core/game/components/weapon/Shotgun';
import { WeaponToAdd } from '@core/game/components/weapon/WeaponToAdd';
import { WeaponType } from '@core/game/constants';
import { WeaponControlSystemNode } from '@core/game/nodes';

export class WeaponControlSystem extends ListIteratingSystem<WeaponControlSystemNode> {
    private weapons: Map<WeaponType, typeof BaseWeapon> = new Map()

    public constructor() {
        super(WeaponControlSystemNode);

        this.weapons.set(WeaponType.Pistol, Pistol);
        this.weapons.set(WeaponType.Shotgun, Shotgun);
    }

    public updateNode(node: WeaponControlSystemNode): void {
        const { weaponToAdd } = node;
        const { type } = weaponToAdd;

        const Weapon = this.weapons.get(type);
        if (Weapon) {
            this.weapons.forEach(wt => {
                if (node.entity.has(wt)) {
                    node.entity.remove(wt);
                }
            });
            node.entity.remove(WeaponToAdd);
            node.entity.add(new Weapon());
        }
    }
}