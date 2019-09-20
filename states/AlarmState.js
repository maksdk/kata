//@ts-check
import BasicState from "./BasicState";
import ClockState from "./ClockState";
import BellState from "./BellState";

const MODE = "alarm";

export default class AlarmState extends BasicState {
   constructor(mainClass) {
      super(mainClass);

      this.nextState = ClockState;
      this.mode = MODE;
      this.typeTime = "alarmTime";
   }

   tick() {
      if (this.mainClass.isAlarmTime()) {
         this.setNextState(BellState);
      }
   }
}