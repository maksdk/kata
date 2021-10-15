import { Vector } from '@core/game/math/Vector';
import { IInputControlSystemEvent, InputControlView, InputControlViewEvent } from '@core/game/graphics/InputControlView';

export class InputControl {
    public down: IInputControlSystemEvent | null = null;
    public pointer: { position: Vector; } | null = null;

    public constructor(private view?: InputControlView) {
        if (view) {
            view.on(InputControlViewEvent.OnDown, this.onDown, this);
            view.on(InputControlViewEvent.OnUp, this.onUp, this);
            view.on(InputControlViewEvent.OnMove, this.onMove, this);
        }
    }

    private onUp(e: IInputControlSystemEvent): void {
        if (this.pointer) {
            this.pointer = null;
        }
    }

    private onDown(e: IInputControlSystemEvent): void {
        this.pointer = {
            position: e.point
        };
    }

    private onMove(e: IInputControlSystemEvent): void {
        if (!this.pointer) {
            return;
        }
        this.pointer = {
            position: e.point
        };
    }
}