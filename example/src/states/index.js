//@ts-check
import EventEmitter from "eventemitter3";
import AlarmState from "./AlarmState";
import BellState from "./BellState";
import ClockState from "./ClockState";

const states = [
   AlarmState,
   BellState,
   ClockState
];
 
export default class FSM extends EventEmitter {
   constructor(initStore) {
      super();

      this.store = { ...initStore };
      this.currentState = null;
   }

   start() {
      const ClassState = FSM.getState(this.store.state);
      this.currentState = new ClassState(this);
   }

   setState(name) {
      this.store.state = name;
      const ClassState = FSM.getState(name);
      this.currentState = new ClassState(this);
      this.emit("updateState", this.store);
   }

   static getState(name) {
      const CurrentState = states.find(state => state.stateName === name);
      if (!CurrentState) throw new Error(`Such state name - ${name} , is not existed.`);
      return  CurrentState;
   }
}