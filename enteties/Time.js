//@ts-check
export default class Time {
   constructor(hours, minutes) {
      this._hours = hours || 0;
      this._minutes = minutes || 0;
   }

   get minutes() {
      return this._minutes;
   }

   set minutes(m) {
      this._minutes = m;
   }

   get hours() {
      return this._hours;
   }

   set hours(h) {
      this._hours = h;
   }

   incrementH() {
      const h = this.hours;
      this.hours = (h + 1) % 24;
   }

   incrementM() {
      const m = this.minutes;
      this.minutes = (m + 1) % 60;
   }

   tick() {
      this.incrementM();
      if (this.minutes === 0) {
         this.incrementH();
      }
   }
}