//@ts-check
import BasicState from "./BasicState";

export default class BellState extends BasicState {
   static get stateName() {
      return "BELL";
   }

   clickHour() {
      console.log("State: " + BellState.stateName);
   }

   clickMinute() {
      console.log("State: " + BellState.stateName);
   }

   clickMode() {
      this.controller.setState("CLOCK");
   }

   tick() {
      console.log("State: " + BellState.stateName);
   }
}  