//@ts-check
import BasicState from "./BasicState";

const MODE = "bell";

export default class BellState extends BasicState {
   constructor(mainClass) {
      super(mainClass);

      this.mode = MODE;
   }
}