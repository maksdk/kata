import { IInputControlSystemEvent, InputControlView, InputControlViewEvent } from '@core/game/graphics/InputControlView';
import { Vector } from '@core/game/math/Vector';
import { Scene } from '@core/game/Scene';
import { utils } from 'pixi.js';

type InputCommandType = 'start' | 'moving' | 'stop';

interface IInputCommand {
    type: InputCommandType;
    angle: number;
    direction: Vector;
}

export enum InputEvent {
    StartMove = 'StartMove',
    StopMove = 'StopMove',
    Moving = 'Moving'
}

export class InputController extends utils.EventEmitter {
    public readonly view: InputControlView;
    private input: IInputCommand | null = null;

    public constructor(private scene: Scene) {
        super();

        this.view = new InputControlView(this.scene.width, this.scene.height);
        this.view.on(InputControlViewEvent.StartMove, this.onStartMove, this);
        this.view.on(InputControlViewEvent.StopMove, this.onStopMove, this);
        this.view.on(InputControlViewEvent.Moving, this.onMoving, this);
    }

    public getMove(): IInputCommand | null {
        const input = this.input;
    
        if (input && input.type !== 'moving') {
            return null;
        }

        return input;
    }

    private onStartMove(e: IInputControlSystemEvent): void {
        this.input = { type: 'start', angle: e.angle, direction: e.direction };
        this.emit(InputEvent.StartMove, { angle: e.angle, direction: e.direction });
    }

    private onMoving(e: IInputControlSystemEvent): void {
        this.input = { type: 'moving', angle: e.angle, direction: e.direction };
        this.emit(InputEvent.Moving, { angle: e.angle, direction: e.direction });
    }

    private onStopMove(e: IInputControlSystemEvent): void {
        this.input = { type: 'stop', angle: e.angle, direction: e.direction };
        this.emit(InputEvent.StopMove, { angle: e.angle, direction: e.direction });
    }
}