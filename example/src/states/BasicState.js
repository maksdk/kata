//@ts-check
import AlarmState from "./AlarmState";
import BellState from "./BellState";
import ClockState from "./ClockState";

const states = [
   AlarmState,
   BellState,
   ClockState
];

export default class BasicState {
   constructor(component) {
      this.component = component;
      this.states = states;
   }

   static get stateName() {
      return "BasicState";
   }

   setNextState(stateName) {
      const NextStateClass = this.states.find(s => s.stateName === stateName);
      if (NextStateClass) {
         this.component.setState(new NextStateClass(this.component));
      }
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