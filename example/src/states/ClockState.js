//@ts-check
import BasicState from "./BasicState";

export default class ClockState extends BasicState {
   static get stateName() {
      return "CLOCK";
   }

   clickHour() {
      this.incrementH("clock");
   }

   clickMinute() {
      this.incrementM("clock");
   }

   clickMode() {
      this.fsm.setState("ALARM");
   }

   longClickMode() {
      this.toggleAlarm();
   }
}