//@ts-check
import BasicState from "./BasicState";
import ClockState from "./ClockState";

const MODE = "alarm";

export default class AlarmState extends BasicState {
   constructor(mainClass) {
      super(mainClass);
      this._mainClass = mainClass;
      this.nextState = ClockState;
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