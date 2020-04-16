import '@babel/polyfill';

// BEGIN (write your solution here)
export default class Seq {
  constructor(startValue, fn, countElems = Infinity) {
    this.startValue = startValue;
    this.fn = fn;
    this.countElems = countElems;
  }

  skip(count) {
    const newStartValue = new Array(count)
      .fill(1)
      .reduce((acc) => this.fn(acc), this.startValue);

    const seq = new Seq(newStartValue, this.fn, this.countElems);
    seq[Symbol.iterator] = function* () {
      yield this.startValue; 
    };
    return seq;
  }

  take(count) {
    const seq = new Seq(this.startValue, this.fn, this.countElems);
    
    seq[Symbol.iterator] = function* () {
      const collection = [this.startValue];
      let currentIndex = 0;

      while(currentIndex < count) {
        const currentValue = collection[currentIndex];
        const nextValue = this.fn(currentValue);
        collection.push(nextValue);

        currentIndex += 1;

        yield currentValue;
      }
    };

    return seq;
  }
}
// END
