//@ts-check
const MODE = "alarm";

export default class AlarmState {
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