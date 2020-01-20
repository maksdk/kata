//@ts-check
import { Application, Graphics, Container, Text } from "pixi.js";

const config = {
    width: window.innerWidth, 
    height: window.innerHeight,
    backgroundColor: 0x000
};

function game() {
    const app = new Application(config);
    document.body.appendChild(app.view);
    
    const scene = app.stage.addChild(new Container());
    scene.position.set(app.renderer.width / 2, app.renderer.height / 2);

    const clock = scene.addChild(new Container());
    clock.position.set(-150, -100);

    clock.addChild(new Graphics())
    .beginFill(0x0b6311)
    .drawRoundedRect(0, 0, 400, 200, 10)
    .endFill();

    const clockTime = clock.addChild(new Text("00:00", { fill: 0xFFF, fontSize: 100 }));
    clockTime.anchor.set(0.5);
    clockTime.position.set(200, 65);

    const hourButton = createButton("H");
    hourButton.position.set(75, 150);
    hourButton.interactive = true;
    hourButton.on("pointerdown", () => console.log("h"));
    clock.addChild(hourButton);
    
    const minuteButton = createButton("M");
    minuteButton.position.set(200, 150);
    minuteButton.interactive = true;
    minuteButton.on("pointerdown", () => console.log("m"));
    clock.addChild(minuteButton);
    
    const modeButton = createButton("Mode", 0xf44336);
    modeButton.position.set(325, 150);
    modeButton.interactive = true;
    modeButton.on("pointerdown", () => console.log("mode"));
    clock.addChild(modeButton);
};

function createButton(title="Button", tint=0xffc107) {
    const btn = new Container();
    
    btn.addChild(new Graphics())
        .beginFill(tint)
        .drawRoundedRect(-50, -25, 100, 50, 10)
        .endFill();

    const titleText = btn.addChild(new Text(title, { fill: 0x000, fontSize: 30}));
    titleText.anchor.set(0.5);

    return btn;
}

export default game;