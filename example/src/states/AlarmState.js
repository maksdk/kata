//@ts-check
import BasicState from "./BasicState";

export default class AlarmState extends BasicState {
   static get stateName() {
      return "ALARM";
   }

   clickHour() {
      this.controller.store.alarm.h += 1;
      if (this.controller.store.alarm.h === 24) {
         this.controller.store.alarm.h = 0;
      }

      this.controller.emit("updateStore", this.controller.store);
   }

   clickMinute() {
      this.controller.store.alarm.m += 1;
      if (this.controller.store.alarm.m === 60) { 
         this.controller.store.alarm.m = 0;
      }
      this.controller.emit("updateStore", this.controller.store);
   }

   clickMode() {
      this.controller.setState("CLOCK");
   }
}