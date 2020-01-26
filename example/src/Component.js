//@ts-check
import { Application } from "pixi.js";
// import { ClockState } from "./states/index";
import State from "./states/index";
import View from "./view/View";
import Model from "./model/Model";

class Component {
   constructor() {
      this.initData = {
         currentState: "CLOCK-STATE",
         alarmTime: { h: 6, m: 0 },
         clockTime: { h: 10, m: 0 }
      };

      this.view = null;
      this.state = null;
      this.model = null;
   }

   init() {
      const app = new Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x000000});
      document.body.appendChild(app.view);

      const view = app.stage.addChild(new View(this.initData));
      view.position.set(app.renderer.width / 2, app.renderer.height / 2);
      this.view = view;

      this.model = new Model(this.initData);
      this.state = State.getState(this.initData.currentState);
   }
   
   start() {
      this.view.create();
      this.view.on("clickHour", this.state.clickHour, this.state);
      this.view.on("clickMinute", this.state.clickMinute, this.state);
      this.view.on("longClickMode", this.state.longClickMode, this.state);
      this.view.on("clickMode", this.state.clickMode, this.state);

      this.model.on("update", this.view.updateData, this.view);
   }

   setState(StateKlass) {
      this.state = new StateKlass(this);
      // this.state.start();
   }

   clickHour() {
      this.state.clickHour();
   }

   clickMinute() {
      this.state.clickMinute();
   }

   clickMode() {
      this.state.clickMode();
   }

   longClickMode() {
      this.state.longClickMode();
   }
}

export default Component;