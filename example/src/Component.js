//@ts-check
import { Application } from "pixi.js";
import StateController from "./states/index";
import View from "./views/AlarmClock";

class Component {
   constructor() {
      this.initStore = {
         state: "CLOCK",
         alarm: {h: 8, m: 0, on: false },
         clock: {h: 7, m: 58 }
      };

      this.view = null;
      this.stateController = null;
   }

   init() {
      // view
      const app = new Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x000000});
      document.body.appendChild(app.view);
      
      const view = app.stage.addChild(new View(this.initStore));
      view.position.set(app.renderer.width / 2, app.renderer.height / 2);
      this.view = view;

      // state
      this.stateController = new StateController(this.initStore);
   }
   
   start() {
      //view
      this.view.create();
      this.view.setData(this.initStore);

      this.view.on("clickHour", this.clickHour, this);
      this.view.on("clickMinute", this.clickMinute, this);
      this.view.on("longClickMode", this.longClickMode, this);
      this.view.on("clickMode", this.clickMode, this);
      this.view.on("clickTick", this.clickTick, this);

      // state
      this.stateController.setState(this.initStore.state);
      this.stateController.on("updateState", this.updateState, this);
      // this.stateController.on("updateStore", this.updateStore, this);
   }

   updateState(data) {
      this.view.setData(data);
   }

   // updateStore(data) {
   //    this.view.setData(data);
   // }

   clickHour() {
      this.stateController.currentState.clickHour();
   }

   clickMinute() {
      this.stateController.currentState.clickMinute();
   }

   clickMode() {
      this.stateController.currentState.clickMode();
   }

   longClickMode() {
      this.stateController.currentState.longClickMode();
   }

   clickTick() {
      this.stateController.currentState.tick();
   }
}

export default Component;