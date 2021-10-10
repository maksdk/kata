import { RenderViewLayer } from '@core/game/systems/RenderSystem';
import { DisplayObject } from 'pixi.js';

export class Display {
    public constructor(
        public displayObject: DisplayObject, 
        public layer?: RenderViewLayer,
    ) {}
}