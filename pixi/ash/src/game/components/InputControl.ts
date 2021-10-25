import { Vector } from '@game/math/Vector';
import { IInputControlSystemEvent, InputControlView, InputControlViewEvent } from '@core/game/graphics/InputControlView';

export class InputControl {
    public down: IInputControlSystemEvent | null = null;
    public pointer: {
        angle: number;
        direction: Vector;
    } | null = null;

    public constructor(private view?: InputControlView) {
        if (this.view) {
            this.view.on(InputControlViewEvent.StartMove, this.onStartMove, this);
            this.view.on(InputControlViewEvent.StopMove, this.onStopMove, this);
            this.view.on(InputControlViewEvent.Moving, this.onMoving, this);
        }
    }

    private onStartMove(e: IInputControlSystemEvent): void {
        this.pointer = {
            angle: e.angle,
            direction: e.direction,
        };
    }

    private onMoving(e: IInputControlSystemEvent): void {
        if (!this.pointer) {
            return;
        }
        this.pointer = {
            angle: e.angle,
            direction: e.direction,
        };
    }

    private onStopMove(): void {
        this.pointer = null;
    }
}