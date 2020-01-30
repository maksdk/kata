//@ts-check
import EventEmitter from "eventemitter3";

import AlarmState from "./AlarmState";
import BellState from "./BellState";
import ClockState from "./ClockState";

 
export default class StateController extends EventEmitter {
   constructor(initStore) {
      super();

      this.states = [
         AlarmState,
         BellState,
         ClockState
      ];

      this.store = { 
         ...initStore 
      };
      
      this.currentState = null;
   }

   setState(name) {
      this.store.state = name;

      const ClassState = this.getState(name);
      this.currentState = new ClassState(this);

      this.emit("updateState", this.store);
   }

   getState(name) {
      const CurrentState = this.states.find(state => state.stateName === name);
      if (!CurrentState) throw new Error(`Such state name - ${name}, is not existed.`);
      return  CurrentState;
   }
}