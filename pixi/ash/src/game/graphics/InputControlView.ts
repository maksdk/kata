import { Vector } from '@core/game/math/Vector';
import { Container, Graphics, InteractionEvent, Rectangle } from 'pixi.js';

export enum InputControlViewEvent {
    OnDown = 'InputControlViewEvent.OnDown',
    OnUp = 'InputControlViewEvent.OnUp',
    OnMove = 'InputControlViewEvent.OnMove',
}

export interface IInputControlSystemEvent {
    point: Vector;
}

export class InputControlView extends Container {
    public constructor(private w: number, private h: number) {
        super();

        this.hitArea = new Rectangle(w * -0.5, h * -0.5, w, h);
        this.interactive = true;
        this.buttonMode = true; // show pointer

        this.on('pointerdown', this.onDown, this);
        this.on('pointerup', this.onUp, this);
        this.on('pointermove', this.onMove, this);

        this.drawDebug();
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

    private drawDebug(): void {
        this.addChild(new Graphics())
            .lineStyle(2, 0xFFFFFF)
            .beginFill(0xFFFFFF, 0.3)
            .drawCircle(0, this.h * 0.3, 100)
            .beginFill(0xFFFFFF, 0.5)
            .drawCircle(0, this.h * 0.3, 50)
            .endFill();
    }
}