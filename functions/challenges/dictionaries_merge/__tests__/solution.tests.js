// @ts-check
import combine from '../dictionary.js';

describe('dictionary merge', () => {
  test('test #1', () => {
    const actual = combine(
      { a: 1, b: 2 },
      { a: 3 },
    );
    const expected = { a: [1, 3], b: [2] };
    expect(actual).toEqual(expected);
  });

  test('test #2', () => {
    const actual = combine(
      { a: 1, b: 2, c: 3 },
      { a: 3, b: 4 },
      { a: 7, c: 1, d: 8 },
    );
    const expected = {
      a: [1, 3, 7], b: [2, 4], c: [3, 1], d: [8],
    };
    expect(actual).toEqual(expected);
  });

  test('test #3', () => {
    const actual = combine(
      { a: 1, b: 2, c: 3 },
      { a: 3, b: 4 },
      { a: 3, b: 2, d: 5 },
    );
    const expected = {
      a: [1, 3], b: [2, 4], c: [3], d: [5],
    };
    expect(actual).toEqual(expected);
  });

  test('test #4', () => {
    const actual = combine(
      { a: 1, b: 2, c: 3 },
      {},
      { a: 3, b: 2, d: 5 },
      { a: 6 },
      { b: 4, c: 3, d: 2 },
      { e: 9 },
    );
    const expected = {
      a: [1, 3, 6], b: [2, 4], c: [3], d: [5, 2], e: [9],
    };
    expect(actual).toEqual(expected);
  });

  test('test #5', () => {
    const actual = combine({}, {}, {}, {});
    const expected = {};
    expect(actual).toEqual(expected);
  });
});
