//@ts-check
import BasicState from "./BasicState";

export default class ClockState extends BasicState {
   static get stateName() {
      return "CLOCK-STATE";
   }
}