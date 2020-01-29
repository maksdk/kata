//@ts-check
export default class BasicState {
   constructor(controller) {
      this.controller = controller;
   }

   static get stateName() {
      return "BASIC";
   }
   
   isBell() {
      const { clock, alarm } = this.controller.store;
      if (alarm.on === false) return false;
      if (clock.h === alarm.h && clock.m === alarm.m) return true;
      return false;
   }

   /**
    * @abstract
    */
   clickHour() {
      console.warn("I am a method of the Basic State. Override me, a stupid programmer");
   }

   /**
    * @abstract
    */
   clickMinute() {
      console.warn("I am a method of the Basic State. Override me, a stupid programmer");
   }

   /**
    * @abstract
    */
   clickMode() {
      console.warn("I am a method of the Basic State. Override me, a stupid programmer");
   }

   /**
    * @abstract
    */
   longClickMode() {
      console.warn("I am a method of the Basic State. Override me, a stupid programmer");
   }

   /**
    * @abstract
    */
   tick() {
      console.warn("I am a method of the Basic State. Override me, a stupid programmer");
   }
}