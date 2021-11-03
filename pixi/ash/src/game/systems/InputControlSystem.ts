import { System, Engine, NodeList, defineNode } from '@ash.ts/ash';
import { Character } from '@core/game/components/Character';
import { Input } from '@core/game/components/Input';
import { InputController, InputEvent } from '@core/game/InputController';

const InputControlNode = defineNode({
    input: Input,
    character: Character,
}, 'InputControlNode');
type InputControlNode = InstanceType<typeof InputControlNode>;


export class InputControlSystem extends System {
    private nodes: NodeList<InputControlNode>;

    public constructor(private input: InputController) {
        super();
    }

    public addToEngine(engine: Engine): void {
        this.nodes = engine.getNodeList(InputControlNode);

        this.input.on(InputEvent.StartMove, this.onStartMotion, this);
        this.input.on(InputEvent.StopMove, this.onStopMotion, this);
    }

    public removeFromEngine(engine: Engine): void {
        this.nodes = null;
        this.input.off(InputEvent.StartMove, this.onStartMotion, this);
        this.input.off(InputEvent.StopMove, this.onStopMotion, this);
    }

    private onStartMotion(): void {
        
        for (let node = this.nodes.head; node; node = node.next) {
            const { character } = node;
            character.fsm.changeState('motion');
        }
    }

    private onStopMotion(): void {
        for (let node = this.nodes.head; node; node = node.next) {
            const { character } = node;
            character.fsm.changeState('shooting');
        }
    }

    public update(): void {
        // nothing
    }
}