//@ts-check

export default class BasicState {
   constructor(mainClass) {
      this.mainClass = this.mainClass;
      this.nextState = null;
      this.mode = null;
   }

   setNextState() {
      this.mainClass.setNextState(this.nextState);
   }

   getMode() {
      return this.mode;
   }
}