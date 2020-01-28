//@ts-check
import BasicState from "./BasicState";

export default class BellState extends BasicState {
   static get stateName() {
      return "BELL";
   }

   tick() {
      console.log("BELL")
   }

   clickHour() {
      console.log("BELL")
   }

   clickMinute() {
      console.log("BELL")
   }

   clickMode() {
      this.fsm.setState("CLOCK");
   }
   
}  