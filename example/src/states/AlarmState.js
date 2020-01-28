//@ts-check
import BasicState from "./BasicState";

export default class AlarmState extends BasicState {
   static get stateName() {
      return "ALARM";
   }

   clickHour() {
      this.incrementH("alarm");
   }

   clickMinute() {
      this.incrementM("alarm");
   }

   clickMode() {
      this.fsm.setState("CLOCK");
   }
}