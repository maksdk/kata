//@ts-check
import { Graphics, Container, Text } from "pixi.js";

export default class MainStage extends Container {
    constructor() {
        super();

        this.timeFace = null;
        this.hourButton = null;
        this.minuteButton = null;
        this.buttonMode = null;

        this.create();
    }

    clickMode(e) {

    }

    clickHour(e) {
        
    }

    clickMinute(e) {
        
    }

    create() {
        const container = this.addChild(new Container());
        container.position.set(-150, -100);

        container.addChild(new Graphics())
            .beginFill(0x0b6311)
            .drawRoundedRect(0, 0, 400, 200, 10)
            .endFill();

        const timeFace = container.addChild(new Text("00:00", { fill: 0xFFF, fontSize: 100 }));
        timeFace.anchor.set(0.5);
        timeFace.position.set(200, 65);
        this.timeFace = timeFace;
        
        const hourButton = container.addChild(this.createButton("H", 0xff9800));
        hourButton.position.set(75, 150);
        hourButton.interactive = true;
        hourButton.on("pointerdown", this.clickHour, this);
        this.hourButton = hourButton;
        
        const minuteButton = container.addChild(this.createButton("M", 0xff9800));
        minuteButton.position.set(200, 150);
        minuteButton.interactive = true;
        minuteButton.on("pointerdown", this.clickMinute, this);
        this.minuteButton = minuteButton;
        
        const modeButton = container.addChild(this.createButton("Mode", 0xf44336));
        modeButton.position.set(325, 150);
        modeButton.interactive = true;
        modeButton.on("pointerdown", this.clickMode, this);
        this.modeButton = modeButton;
    }

    createButton(title="Button", color) {
        const btn = new Container();
        btn.addChild(new Graphics())
            .beginFill(color)
            .drawRoundedRect(-50, -25, 100, 50, 10)
            .endFill();
        const titleText = btn.addChild(new Text(title, { fill: 0x000, fontSize: 30 }));
        titleText.anchor.set(0.5);
        return btn;
    }
}