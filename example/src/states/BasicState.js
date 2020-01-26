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

   incrementH(typeTime) {
      const modelData = this.component.model.getData();
      if (!modelData[typeTime]) throw new Error(`Such type - ${typeTime} is not existed`);
      
      let h = modelData[typeTime].h;
      h += 1;
      if (h >= 24) h = 0;
      
      // modelData[typeTime]
   }

   start() {
      console.error("I am a method of the Basic State. Override me, a stupid programmer");
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