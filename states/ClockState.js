//@ts-check
import BasicState from "./BasicState";
import AlarmState from "./AlarmState";

const MODE = "clock";

export default class ClockState extends BasicState {
   constructor(mainClass) {
      super(mainClass);

      this.nextState = AlarmState;
      this.mode = MODE;
   }

   static get mode() {
      return MODE;
   }

   clickH() {

   }

   clickM() {

   }
}