//@ts-check
import { Application } from "pixi.js";
import MainStage from "./MainStage";

const config = {
    width: window.innerWidth, 
    height: window.innerHeight,
    backgroundColor: 0x000
};

export default class View {
    constructor() {
        this.app = null;
    }

    init() {
        this.app = new Application(config);
        document.body.appendChild(this.app.view);
    }

    start() {
        const mainStage = this.app.stage.addChild(new MainStage());
        mainStage.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
    }
}