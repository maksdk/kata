//@ts-check
import BasicState from "./BasicState";
import AlarmState from "./AlarmState";
import BellState from "./BellState";

const MODE = "clock";

export default class ClockState extends BasicState {
   constructor(mainClass) {
      super(mainClass);

      this.nextState = AlarmState;
      this.mode = MODE;
      this.typeTime = "clockTime";
   }

   tick() {
      if (this.mainClass.isAlarmOn() && this.mainClass.isAlarmTime()) {
         this.setNextState(BellState);
      }
   }
}