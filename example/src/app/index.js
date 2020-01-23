//@ts-check
import View from "./view";
import {ClockState} from "../states/index";

class Component {
    constructor() {
        this.view = null;
        this.state = null;
    }

    init() {
        this.view = new View();
        this.view.init();
    }

    start() {
        this.view.start();
        this.setState(ClockState)
    }

    setState(StateKlass) {
        this.state = new StateKlass(this);
    }
}

export default Component;