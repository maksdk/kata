//@ts-check
import ClockState from "../states/ClockState";
import Time from "./Time";

export default class AlarmClock {
   constructor() {
      this.state = null;
      this.setState(ClockState);

      this.clockTime = new Time(12, 0);
      this.alarmTime = new Time(6, 0);

      this._isAlarmOn = false;
   }

   clickMode() {
      this.state.setNextState();
   }

   longClickMode() {
      this._isAlarmOn = !this._isAlarmOn;
   }

   getCurrentMode() {
      return this.state.getMode();
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

   clickH() {
      this.state.clickH();
   }

   clickM() {
      this.state.clickM();
   }

   incrementH(typeTime) {
      this[typeTime].incrementH();
   }

   incrementM(typeTime) {
      this[typeTime].incrementM();
   }

   tick() {
      this.clockTime.tick();
      this.state.tick();
   }

   isAlarmTime() {
      return this.hours() === this.alarmHours() && 
         this.minutes() === this.alarmMinutes();
   }

   isAlarmOn() {
      return this._isAlarmOn;
   }
}