import { BaseView } from '@core/game/graphics/BaseView';
import { Vector } from '@core/game/math/Vector';
import { Graphics, InteractionEvent, Rectangle } from 'pixi.js';

export enum InputControlViewEvent {
    OnDown = 'InputControlViewEvent.OnDown',
    OnUp = 'InputControlViewEvent.OnUp',
    OnMove = 'InputControlViewEvent.OnMove',
}

export interface IInputControlSystemEvent {
    point: Vector;
}

export class InputControlView extends BaseView {
    private joyTouch: Graphics;
    private joyBg: Graphics;

    public constructor(private w: number, private h: number) {
        super();

        this.hitArea = new Rectangle(w * -0.5, h * -0.5, w, h);
        this.interactive = true;
        this.buttonMode = true; // show pointer

        this.on('pointerdown', this.onDown, this);
        this.on('pointerup', this.onUp, this);
        this.on('pointermove', this.onMove, this);

        this.joyBg = this.addChild(new Graphics())
            .lineStyle(2, 0xFFFFFF)
            .beginFill(0xFFFFFF, 0.3)
            .drawCircle(0, 0, 100)
            .endFill();

        this.joyTouch = this.addChild(new Graphics())
            .lineStyle(2, 0xFFFFFF)
            .beginFill(0xFFFFFF, 0.5)
            .drawCircle(0, 0, 45)
            .endFill();
    }

    private onDown(e: InteractionEvent): void {
        const pos = e.data.getLocalPosition(this);
        this.emit(InputControlViewEvent.OnDown, { point: new Vector(pos.x, pos.y) });
    }

    private onUp(e: InteractionEvent): void {
        const pos = e.data.getLocalPosition(this);
        this.emit(InputControlViewEvent.OnUp, { point: new Vector(pos.x, pos.y) });
    }

    private onMove(e: InteractionEvent): void {
        const pos = e.data.getLocalPosition(this);
        this.emit(InputControlViewEvent.OnMove, { point: new Vector(pos.x, pos.y) });
    }
}