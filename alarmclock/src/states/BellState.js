//@ts-check
import BasicState from "./BasicState";

export default class BellState extends BasicState {
   static get stateName() {
      return "BELL";
   }
   clickMode() {
      this.controller.setState("CLOCK");
   }
}  