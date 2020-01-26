//@ts-check
import AlarmState from "./AlarmState";
import BellState from "./BellState";
import ClockState from "./ClockState";

const states = [
   AlarmState,
   BellState,
   ClockState
];
 
export default class State {
   

   static getState(name) {
      const CurrentState = states.find(state => state.stateName === name);
      if (!CurrentState) throw new Error(`Such state name - ${name} , is not existed.`);
      return new CurrentState();
   }
}