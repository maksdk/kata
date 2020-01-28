//@ts-check
import { Application } from "pixi.js";
import FSM from "./states/index";
import View from "./view/View";

class Component {
   constructor() {
      this.initStore = {
         state: "CLOCK",
         alarm: {h: 8, m: 0, on: false },
         clock: {h: 7, m: 58 }
      };

      this.view = null;
      this.fsm = null;
   }

   init() {
      const app = new Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x000000});
      document.body.appendChild(app.view);
      const view = app.stage.addChild(new View(this.initStore));
      view.position.set(app.renderer.width / 2, app.renderer.height / 2);
      this.view = view;

      this.fsm = new FSM(this.initStore);
   }
   
   start() {
      this.view.create();
      this.view.on("clickHour", this.clickHour, this);
      this.view.on("clickMinute", this.clickMinute, this);
      this.view.on("longClickMode", this.longClickMode, this);
      this.view.on("clickMode", this.clickMode, this);
      this.view.on("clickTick", this.clickTick, this);

      this.fsm.start();
      this.fsm.on("updateState", this.updateState, this);
      this.fsm.on("updateStore", this.updateStore, this);
   }

   updateState(e) {
      this.view.updateData(e);
   }

   updateStore(e) {
      this.view.updateData(e);
   }

   clickHour() {
      this.fsm.currentState.clickHour();
   }

   clickMinute() {
      this.fsm.currentState.clickMinute();
   }

   clickMode() {
      this.fsm.currentState.clickMode();
   }

   longClickMode() {
      this.fsm.currentState.longClickMode();
   }

   clickTick() {
      this.fsm.currentState.tick();
   }
}

export default Component;