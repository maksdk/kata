//@ts-check
export default class BasicState {
   constructor(component) {
      this.component = component;
   }

   static get stateName() {
      return "BasicState";
   }

   setNextState(NextStateClass) {
      this.component.setState(NextStateClass);
   }

   clickHour() {
      console.error("I am a method of the Basic State. Override me, a stupid programmer");
   }

   clickMinute() {
      console.error("I am a method of the Basic State. Override me, a stupid programmer");
   }

   clickMode() {
      console.error("I am a method of the Basic State. Override me, a stupid programmer");
   }

   longClickMode() {
      console.error("I am a method of the Basic State. Override me, a stupid programmer");
   }

   tick() {
      console.error("I am a method of the Basic State. Override me, a stupid programmer");
   }
}