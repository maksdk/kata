class Seq {
  constructor(start, next, count = Infinity) {
    this.start = start;
    this.next = next;
    this.count = count;
  }

  // Синтаксис объявления генератора на уровне класса
  * [Symbol.iterator]() {
    let current = this.start;
    for (let i = 0; i < this.count; i += 1) {
      yield current;
      current = this.next(current);
    }
  }

  take(count) {
    return new Seq(this.start, this.next, count);
  }

  skip(count) {
    if (this.count < count) {
      throw new Error('It is not possible to skip more values than the sequence contains');
    }
    const iterator = this[Symbol.iterator]();
    let result;
    for (let i = 0; i <= count; i += 1) {
      result = iterator.next();
    }
    return new Seq(result.value, this.next, this.count - count);
  }
}

export default Seq;