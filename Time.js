//@ts-check
export default class Time {
   constructor(hours, minutes) {
      this._hours = hours || 0;
      this._minutes = minutes || 0;
   }

   get minutes() {
      return this._minutes;
   }

   get hours() {
      return this._hours;
   }
}