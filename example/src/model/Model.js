//@ts-check
import EventEmitter from "eventemitter3";

export default class Model extends EventEmitter {
   constructor(initData={}) {
      super();
      this.data = {...initData};
   }

   setData(data) {
      this.data = { ...this.data, ...data };
      this.emit("update", { ...this.data });
   }

   getData() {
      return this.data;
   }
}