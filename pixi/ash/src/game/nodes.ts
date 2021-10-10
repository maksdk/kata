import { defineNode } from '@ash.ts/ash';
import { Bullet } from '@core/game/components/Bullet';
import { Character } from '@core/game/components/Character';
import { Collision } from '@core/game/components/Collision';
import { Display } from '@core/game/components/Display';
import { Gun } from '@core/game/components/Gun';
import { InputControl } from '@core/game/components/InputControl';
import { Motion } from '@core/game/components/Motion';
import { Transform } from '@core/game/components/Transform';
import { Wall } from '@core/game/components/Wall';

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

export const GunControlNode = defineNode({
    gun: Gun,
    transform: Transform,
}, 'GunControlNode');
export type GunControlNode = InstanceType<typeof GunControlNode>;

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