import co from '../co';

describe('HexletCo', () => {
  it('set 1', () => {
    const promise = co(function* gen() {
      const x = yield Promise.resolve(5);
      return x;
    });
    return expect(promise).resolves.toBe(5);
  });

  it('set 2', () => {
    const promise = co(function* gen() {
      const a = yield Promise.resolve(1);
      const b = yield Promise.resolve(2);
      const c = yield Promise.resolve(3);

      return [a, b, c];
    });
    return expect(promise).resolves.toEqual([1, 2, 3]);
  });

  it('set 3', () => {
    let error;

    const promise = co(function* gen() {
      try {
        yield Promise.reject(new Error('boom'));
      } catch (err) {
        error = err;
      }

      expect(error.message).toBe('boom');
      const ret = yield Promise.resolve(1);
      return ret;
    });

    return expect(promise).resolves.toBe(1);
  });

  it('set 4', () => {
    const promise = co(function* gen() {
      yield Promise.resolve(5);
      throw new Error('boom');
    });
    return expect(promise).rejects.toThrow();
  });

  it('set 5', () => {
    const promise = co(function* gen() {
      const a = yield Promise.resolve(1);
      return a;
    });
    return expect(promise).resolves.toBe(1);
  });

  it('set 6', () => {
    const promise = co(function* gen() {
      const result = yield Promise.reject(new Error('boom'));
      return result;
    });
    return expect(promise).rejects.toThrow();
  });

  it('set 7', () => {
    const promise = co(function* gen() {
      const a = yield Promise.resolve(1);
      const b = yield Promise.resolve(a * 4);
      const c = yield Promise.resolve(b / 2);

      return [a, b, c];
    });
    return expect(promise).resolves.toEqual([1, 4, 2]);
  });
});
