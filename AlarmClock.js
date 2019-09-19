//@ts-check
import ClockState from "./ClockState";
import AlarmState from "./AlarmState";
import Time from "./Time";

export default class AlarmClock {
   constructor() {
      this.state = null;
      this.setState(ClockState);

      this.clockTime = new Time(12, 0);
      this.alarmTime = new Time(6, 0);
   }

   clickMode() {
      this.state.setNextState();
   }

   getCurrentMode() {
      return this.state.getMode();
   }

   isAlarmOn() {
      const currMode = this.state.getMode();
      return currMode === AlarmState.mode;
   }

   setState(Klass) {
      this.state = new Klass(this);
   }

   minutes() {
      return this.clockTime.minutes;
   }

   hours() {
      return this.clockTime.hours;
   }

   alarmHours() {
      return this.alarmTime.hours;
   }

   alarmMinutes() {
      return this.alarmTime.minutes;
   }
}