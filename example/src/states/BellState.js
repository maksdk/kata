//@ts-check
import BasicState from "./BasicState";

export default class BellState extends BasicState {
   static get stateName() {
      return "BELL";
   }

   clickHour() {
      console.log("BELL")
   }

   clickMinute() {
      console.log("BELL")
   }

   clickMode() {
      this.controller.setState("CLOCK");
   }

   tick() {
      console.log("BELL")
   }
}  