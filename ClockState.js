//@ts-check
const MODE = "clock";

export default class ClockState {
   constructor(mainClass) {
      this._mainClass = mainClass;
   }

   static get mode() {
      return MODE;
   }

   getMode() {
      return MODE;
   }

   clickH() {

   }

   clickM() {

   }
}