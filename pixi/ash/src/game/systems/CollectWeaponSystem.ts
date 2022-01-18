import { defineNode, Engine, NodeList, System } from '@ash.ts/ash';
import { WeaponItem } from '@core/game/components/WeaponItem';
import { Transform } from '@core/game/components/Transform';
import { Character } from '@core/game/components/Character';
import { circleInRect } from '@core/game/math/collision';
import { World } from '@core/game/World';
import { Pistol } from '@core/game/components/Pistol';
import { Shotgun } from '@core/game/components/Shotgun';

// TODO: System is used to collect and use new weapons in the World

const WeaponItemNode = defineNode({
    transform: Transform,
    weaponItem: WeaponItem,
}, 'WeaponItemNode');

type WeaponItemNode = InstanceType<typeof WeaponItemNode>;

const CharacterNode = defineNode({
    transform: Transform,
    character: Character,
}, 'CharacterNode');

type CharacterNode = InstanceType<typeof CharacterNode>;

export class CollectWeaponSystem extends System {
    private weapons: NodeList<WeaponItemNode> | null = null;
    private characters: NodeList<CharacterNode> | null = null;

    private weaponComponents: [typeof Pistol, typeof Shotgun] = [Pistol, Shotgun];

    public constructor(private world: World) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.weapons = engine.getNodeList(WeaponItemNode);
        this.characters = engine.getNodeList(CharacterNode);
    }

    public removeFromEngine(): void {
        this.weapons = null;
        this.characters = null;
    }

    public update(): void {
        for (let character = this.characters.head; character; character = character.next) {
            for (let weapon = this.weapons.head; weapon; weapon = weapon.next) {

                const intersect = circleInRect(
                    { x: character.transform.x, y: character.transform.y, r: 20 },
                    { x: weapon.transform.x, y: weapon.transform.y, w: 50, h: 50 },
                );
                
                if (intersect) {
                    const Weapon = this.weaponComponents.find((c) => c.type === weapon.weaponItem.type);
                    
                    if (!Weapon) {
                        console.error(`CollectWeaponSystem - update. Weapon item : "${weapon.weaponItem.type}" is not found in weapon components list.`, this.weaponComponents);
                        continue;
                    }

                    this.weaponComponents.forEach(c => {
                        if (character.entity.has(c)) {
                            character.entity.remove(c);
                        }
                    });

                    // TODO: Maybe in the future use WeaponChangingSystem to add weapons
                    character.entity.add(new Weapon());

                    this.world.removeEntity(weapon.entity);
                }
            }
        }
    }
}