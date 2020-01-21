//@ts-check
import AppView from "./view";

class App {
    constructor() {
        this.view = null;
        // this.state = null;
        // this.controller = null;
        // this.fsm = null;
    }

    init() {
        this.view = new AppView();
        this.view.init();
    }

    start() {
        this.view.start();
    }
}

export default App;