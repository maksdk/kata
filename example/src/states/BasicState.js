//@ts-check
export default class BasicState {
   constructor(fsm) {
      this.fsm = fsm;
   }

   static get stateName() {
      return "BasicState";
   }
   
   setNextState(NextStateClass) {
      this.fsm.setState(NextStateClass);
   }

   incrementH(typeTime) {
      this.fsm.store[typeTime].h += 1;
      if (this.fsm.store[typeTime].h === 24) {
         this.fsm.store[typeTime].h = 0;
      }

      this.fsm.emit("updateStore", this.fsm.store);
   }

   incrementM(typeTime) {
      this.fsm.store[typeTime].m += 1;
      if (this.fsm.store[typeTime].m === 60) { 
         this.fsm.store[typeTime].m = 0;
      }
      this.fsm.emit("updateStore", this.fsm.store);
   }

   toggleAlarm() {
      this.fsm.store.alarm.on = !this.fsm.store.alarm.on;
      this.fsm.emit("updateStore", this.fsm.store);
   }

   tick() {
      console.log("tick")
      this.fsm.store.clock.m += 1;
      if (this.fsm.store.clock.m === 60) {
         this.fsm.store.clock.m = 0;
         
         this.fsm.store.clock.h += 1;
         if (this.fsm.store.clock.h === 24) {
            this.fsm.store.clock.h = 0;
         }
      }

      if (this.isBell()) {
         this.fsm.setState("BELL");
      }
      else {
         this.fsm.emit("updateStore", this.fsm.store);
      }
   }

   isBell() {
      const { clock, alarm } = this.fsm.store;
      if (alarm.on === false) return false;
      if (clock.h === alarm.h && clock.m === alarm.m) return true;
      return false;
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

   
}