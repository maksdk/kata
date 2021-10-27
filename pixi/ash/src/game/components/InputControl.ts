import { Vector } from '@game/math/Vector';
import { IInputControlSystemEvent, InputControlView, InputControlViewEvent } from '@core/game/graphics/InputControlView';

type InputCommandType = 'start' | 'moving' | 'stop';

interface IInputCommand {
    type: InputCommandType;
    angle: number;
    direction: Vector;
}

export class InputControl {
    private input: IInputCommand | null = null;

    public constructor(private view?: InputControlView) {
        if (this.view) {
            this.view.on(InputControlViewEvent.StartMove, this.onStartMove, this);
            this.view.on(InputControlViewEvent.StopMove, this.onStopMove, this);
            this.view.on(InputControlViewEvent.Moving, this.onMoving, this);
        }
    }

    public useInput(): IInputCommand | null {
        const input = this.input;
    
        if (input && input.type === 'stop') {
            this.input = null;
        }

        return input;
    }

    private onStartMove(e: IInputControlSystemEvent): void {
        this.input = { type: 'start', angle: e.angle, direction: e.direction };
    }

    private onMoving(e: IInputControlSystemEvent): void {
        this.input = { type: 'moving', angle: e.angle, direction: e.direction };
    }

    private onStopMove(e: IInputControlSystemEvent): void {
        this.input = { type: 'stop', angle: e.angle, direction: e.direction };
    }
}