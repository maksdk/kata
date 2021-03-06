//@ts-check
import {
   Graphics,
   Container,
   Text
} from "pixi.js";

export default class MainStage extends Container {
   constructor(data={}) {
      super();

      this.data = { ...data };

      this.timerId = null;

      this.timeFace = null;
      this.hourButton = null;
      this.minuteButton = null;
      this.buttonMode = null;
      this.clickButton = null;
      this.alarmPoint = null;
   }

   setData(data={}) {
      const newData = { ...this.data, ...data };
      const { state,  clock, alarm } = newData;

      if (state === "CLOCK") {
         this.timeFace.text = this.fitTimeValue(clock.h, clock.m);
         this.timeFace.style.fill = 0xFFFFFF;
      }

      if (state === "ALARM") {
         this.timeFace.text = this.fitTimeValue(alarm.h, alarm.m);
         this.timeFace.style.fill = 0xFFFF00;
      }

      if (state === "BELL") {
         this.timeFace.text = this.fitTimeValue(alarm.h, alarm.m);
         this.timeFace.style.fill = 0xFF0000;
      }

      this.alarmPoint.tint = alarm.on ? 0xFF0000 : 0xFFFFFF;

      this.title.text = "Current state: " + state;

      this.data = newData;
   }

   fitTimeValue(h, m) {
      const separator = ":";
      const strHour = h.toString().length < 2 ? `0${h}` : h.toString();
      const strMinute = m.toString().length < 2 ? `0${m}` : m.toString();
      return `${strHour}${separator}${strMinute}`;
   }

   onDownHour(e) {
      this.emit("clickHour", this);
   }

   onDownMinute(e) {
      this.emit("clickMinute", this);
   }

   onDownMode() {
      this.timerId = setTimeout(() => {
         clearTimeout(this.timerId);
         this.timerId = null;
         this.emit("longClickMode");
      }, 1000);
   }

   onUpMode() {
      if (this.timerId === null) return;
      clearTimeout(this.timerId);
      this.emit("clickMode");
   }

   onDownTick() {
      this.emit("clickTick");
   }

   create() {
      const container = this.addChild(new Container());
      container.position.set(-150, -100);

      container.addChild(new Graphics())
         .beginFill(0x0b6311)
         .drawRoundedRect(0, 0, 400, 200, 10)
         .endFill();


      this.alarmPoint = container.addChild(new Graphics())
         .beginFill(0xFFFFFF)
         .drawCircle(20, 20, 10)
         .endFill();


      const timeFace = container.addChild(new Text("00:00", {
         fill: 0xFFFFFF,
         fontSize: 100
      }));
      timeFace.anchor.set(0.5);
      timeFace.position.set(200, 65);
      this.timeFace = timeFace;


      const hourButton = container.addChild(this.createButton("H", 0xff9800));
      hourButton.position.set(75, 150);
      hourButton.interactive = true;
      hourButton.on("pointerdown", this.onDownHour, this);
      this.hourButton = hourButton;


      const minuteButton = container.addChild(this.createButton("M", 0xff9800));
      minuteButton.position.set(200, 150);
      minuteButton.interactive = true;
      minuteButton.on("pointerdown", this.onDownMinute, this);
      this.minuteButton = minuteButton;


      const modeButton = container.addChild(this.createButton("Mode", 0xf44336));
      modeButton.position.set(325, 150);
      modeButton.interactive = true;
      modeButton.on("pointerdown", this.onDownMode, this);
      modeButton.on("pointerup", this.onUpMode, this);
      this.modeButton = modeButton;


      const clickButton = container.addChild(this.createButton("Tick", 0xFFFFFF));
      clickButton.position.set(-100, 100);
      clickButton.interactive = true;
      clickButton.on("pointerdown", this.onDownTick, this);
      this.clickButton = clickButton;


      const title = this.addChild(new Text("State", {
         fill: 0x00FFFF,
         fontSize: 40
      }));
      title.anchor.set(0.5);
      title.y = -200;
      this.title = title;
   }

   createButton(title = "Button", color) {
      const btn = new Container();
      btn.addChild(new Graphics())
         .beginFill(color)
         .drawRoundedRect(-50, -25, 100, 50, 10)
         .endFill();
      const titleText = btn.addChild(new Text(title, {
         fill: 0x000,
         fontSize: 30
      }));
      titleText.anchor.set(0.5);
      return btn;
   }
}