//@ts-check
import BasicState from "./BasicState";

export default class ClockState extends BasicState {
   static get stateName() {
      return "CLOCK";
   }

   clickHour() {
      this.controller.store.clock.h += 1;
      if (this.controller.store.clock.h === 24) {
         this.controller.store.clock.h = 0;
      }

      this.controller.emit("updateStore", this.controller.store);
   }

   clickMinute() {
      this.controller.store.clock.m += 1;
      if (this.controller.store.clock.m === 60) { 
         this.controller.store.clock.m = 0;
      }
      this.controller.emit("updateStore", this.controller.store);
   }

   clickMode() {
      this.controller.setState("ALARM");
   }

   longClickMode() {
      this.controller.store.alarm.on = !this.controller.store.alarm.on;
      this.controller.emit("updateStore", this.controller.store);
   }

   tick() {
      this.controller.store.clock.m += 1;
      if (this.controller.store.clock.m === 60) {
         this.controller.store.clock.m = 0;
         
         this.controller.store.clock.h += 1;
         if (this.controller.store.clock.h === 24) {
            this.controller.store.clock.h = 0;
         }
      }

      if (this.isBell()) {
         this.controller.setState("BELL");
      }
      else {
         this.controller.emit("updateStore", this.controller.store);
      }
   }
}