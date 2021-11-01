import { defineNode } from '../libs/ash';
import { Bullet } from '@core/game/components/Bullet';
import { Character } from '@core/game/components/Character';
import { Collision } from '@core/game/components/Collision';
import { Transform } from '@core/game/components/Transform';
import { TriggerTarget } from '@core/game/components/TriggerTarget';
import { TriggerZone } from '@core/game/components/TriggerZone';
import { Wall } from '@core/game/components/Wall';
import { WeaponToAdd } from '@core/game/components/weapon/WeaponToAdd';


export const CharacterNode = defineNode({
    character: Character 
}, 'CharacterNode');
export type CharacterNode = InstanceType<typeof CharacterNode>;

export const CollisionNode = defineNode({
    collision: Collision,
    transform: Transform,
}, 'CollisionNode');
export type CollisionNode = InstanceType<typeof CollisionNode>;

export const CollisionBulletNode = defineNode({
    collision: Collision,
    transform: Transform,
    bullet: Bullet
}, 'CollisionBulletNode');
export type CollisionBulletNode = InstanceType<typeof CollisionBulletNode>;

export const CollisionWallNode = defineNode({
    collision: Collision,
    transform: Transform,
    wall: Wall,
}, 'CollisionWallNode');
export type CollisionWallNode = InstanceType<typeof CollisionWallNode>;

export const TriggerZoneNode = defineNode({
    trigger: TriggerZone,
    transform: Transform,
}, 'TriggerZoneNode');
export type TriggerZoneNode = InstanceType<typeof TriggerZoneNode>;

export const TriggerTargetNode = defineNode({
    transform: Transform,
    triggerTarget: TriggerTarget,
    character: Character,
}, 'TriggerTargetNode');
export type TriggerTargetNode = InstanceType<typeof TriggerTargetNode>;

export const WeaponControlSystemNode = defineNode({
    weaponToAdd: WeaponToAdd,
}, 'WeaponControlSystemNode');
export type WeaponControlSystemNode = InstanceType<typeof WeaponControlSystemNode>;