import { BaseView } from '@core/game/graphics/BaseView';
import { Vector } from '@core/game/math/Vector';
import { Graphics, InteractionEvent, Rectangle } from 'pixi.js';

export enum InputControlViewEvent {
    StartMove = 'InputControlViewEvent.StartMove',
    Moving = 'InputControlViewEvent.Moving',
    StopMove = 'InputControlViewEvent.StopMove',
}

export interface IInputControlSystemEvent {
    angle: number;
    direction: Vector;
}

type JoystickState = 'none' | 'down' | 'move' | 'up';

export class InputControlView extends BaseView {
    private joyTouch: Graphics;
    private joy: Graphics;
    private state: JoystickState = 'none';
    private joyTouchMaxRadius = 50;

    public constructor(private w: number, private h: number) {
        super();

        this.hitArea = new Rectangle(this.w * -0.5, this.h * -0.5, this.w, this.h);
        this.interactive = true;
        this.buttonMode = true; // show pointer

        this.on('pointerdown', this.onDown, this);
        this.on('pointerup', this.onUp, this);
        this.on('pointermove', this.onMove, this);

        this.joy = this.addChild(new Graphics())
            .lineStyle(2, 0xFFFFFF)
            .beginFill(0xFFFFFF, 0.3)
            .drawCircle(0, 0, 100)
            .endFill();
        this.joy.position.set(0, this.h * 0.5 - 150);
        this.joy.visible = false;

        this.joyTouch = this.joy.addChild(new Graphics())
            .lineStyle(2, 0xFFFFFF)
            .beginFill(0xFFFFFF, 0.5)
            .drawCircle(0, 0, 45)
            .endFill();
    }

    private onDown(e: InteractionEvent): void {
        if (this.state === 'none') {
            this.state = 'down';
            this.move(e);
        }
    }

    private onUp(e: InteractionEvent): void {
        if (this.state !== 'none') {
            this.state = 'up';
            this.move(e);
        }
    }

    private onMove(e: InteractionEvent): void {
        if (this.state === 'down' || this.state === 'move') {
            this.state = 'move';
            this.move(e);
        }
    }

    private move(e: InteractionEvent): void {
        const movePos = e.data.getLocalPosition(this);
        const joyPos = new Vector(this.joy.position.x, this.joy.position.y);
        const direction = new Vector(movePos.x - joyPos.x, movePos.y - joyPos.y);
        const angle = Math.atan2(direction.y, direction.x);
    
        if (this.state === 'down') {
            this.joy.visible = true;
            this.joyTouch.position.set(0, 0);
            this.joy.position.set(movePos.x, movePos.y);
            this.emit(InputControlViewEvent.StartMove, { angle: 0, direction: new Vector(0, 0) });
        } else if (this.state === 'move') {
            const x = Math.cos(angle) * this.joyTouchMaxRadius;
            const y = Math.sin(angle) * this.joyTouchMaxRadius;
            this.joyTouch.position.set(x, y);
            this.emit(InputControlViewEvent.Moving, { angle, direction: direction.normalize() });
        } else if (this.state === 'up') {
            this.joy.visible = false;
            this.joyTouch.position.set(0, 0);
            this.joy.position.set(0, this.h * 0.5 - 150);
            this.emit(InputControlViewEvent.StopMove, { angle, direction: direction.normalize() });
            this.state = 'none';
        }
    }
}