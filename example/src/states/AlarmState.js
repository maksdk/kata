//@ts-check
import BasicState from "./BasicState";

export default class AlarmState extends BasicState {
   static get stateName() {
      return "ALARM-STATE";
   }
}