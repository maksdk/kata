//@ts-check
import BasicState from "./BasicState";
import ClockState from "./ClockState";

const MODE = "bell";

export default class BellState extends BasicState {
    constructor(mainClass) {
        super(mainClass);
        this.nextState = ClockState;
        this.mode = MODE;
    }

    tick() {
        this.setNextState();
    }
}