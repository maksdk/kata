//@ts-check
import ClockState from "./ClockState";
import AlarmState from "./AlarmState";

export default class AlarmClock {
   constructor() {
      this.state = null;
      this.setState(ClockState);

      this._minutes = 0;
      this._hours = 12;
      this._alarmHours = 6;
      this._alarmMinutes = 0;
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
      return this._minutes;
   }

   hours() {
      return this._hours;
   }

   alarmHours() {
      return this._alarmHours;
   }

   alarmMinutes() {
      return this._alarmMinutes;
   }
}