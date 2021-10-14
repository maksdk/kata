import { defineNode } from '@ash.ts/ash';
import { Bullet } from '@core/game/components/Bullet';
import { Character } from '@core/game/components/Character';
import { Collision } from '@core/game/components/Collision';
import { Display } from '@core/game/components/Display';
import { Pistol } from '@core/game/components/weapon/Pistol';
import { InputControl } from '@core/game/components/InputControl';
import { Motion } from '@core/game/components/Motion';
import { Transform } from '@core/game/components/Transform';
import { TriggerTarget } from '@core/game/components/TriggerTarget';
import { TriggerZone } from '@core/game/components/TriggerZone';
import { Wall } from '@core/game/components/Wall';
import { Shotgun } from '@core/game/components/weapon/Shotgun';
import { WeaponItem } from '@core/game/components/weapon/WeaponItem';
import { WeaponToAdd } from '@core/game/components/weapon/WeaponToAdd';

export const RenderNode = defineNode({
    display: Display,
    transform: Transform,
}, 'RenderNode');
export type RenderNode = InstanceType<typeof RenderNode>;

export const MotionNode = defineNode({
    motion: Motion,
}, 'MotionNode');
export type MotionNode = InstanceType<typeof MotionNode>; 

export const CharacterNode = defineNode({
    character: Character 
}, 'CharacterNode');
export type CharacterNode = InstanceType<typeof CharacterNode>;

export const PistolControlNode = defineNode({
    pistol: Pistol,
    transform: Transform,
}, 'PistolControlNode');
export type PistolControlNode = InstanceType<typeof PistolControlNode>;

export const ShotgunControlNode = defineNode({
    shotgun: Shotgun,
    transform: Transform,
    motion: Motion,
}, 'ShotgunControlNode');
export type ShotgunControlNode = InstanceType<typeof ShotgunControlNode>;

export const PickingUpWeaponItemNode = defineNode({
    item: WeaponItem,
    transform: Transform,
    trigger: TriggerZone,
}, 'PickingUpWeaponItemNode');
export type PickingUpWeaponItemNode = InstanceType<typeof PickingUpWeaponItemNode>;

export const PickingUpWeaponCharacterNode = defineNode({
    character: Character,
    transform: Transform,
}, 'PickingUpWeaponCharacterNode');
export type PickingUpWeaponCharacterNode = InstanceType<typeof PickingUpWeaponCharacterNode>;

export const MovementNode = defineNode({
    transform: Transform,
    motion: Motion,
}, 'MovementNode');
export type MovementNode = InstanceType<typeof MovementNode>;

export const MotionControlNode = defineNode({
    transform: Transform,
    motion: Motion,
    character: Character,
}, 'MotionControlNode');
export type MotionControlNode = InstanceType<typeof MotionControlNode>;

export const InputControlNode = defineNode({
    input: InputControl,
}, 'InputControlNode');
export type InputControlNode = InstanceType<typeof InputControlNode>;

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