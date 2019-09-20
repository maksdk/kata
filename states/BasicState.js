//@ts-check

export default class BasicState {
   constructor(mainClass) {
      this.mainClass = this.mainClass;
      this.nextState = null;
      this.mode = null;
      this.typeTime = null;
   }

   setNextState(state) {
      this.mainClass.setNextState(state || this.nextState);
   }

   getMode() {
      return this.mode;
   } 

   clickH() {
      this.mainClass.incrementH(this.typeTime);
   }

   clickM() {
      this.mainClass.incrementM(this.typeTime);
   }

   tick() {
      
   }
}