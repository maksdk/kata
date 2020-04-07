// @ts-check

import multiply from '../solution.js';

describe('Matrix Multiplication', () => {
  test('test #1', () => {
    const matrixA = [
      [1, 2],
      [3, 2],
    ];
    const matrixB = [
      [3, 2],
      [1, 1],
    ];
    const expected = [
      [5, 4],
      [11, 8],
    ];
    const actual = multiply(matrixA, matrixB);
    expect(actual).toEqual(expected);
  });

  test('test #2', () => {
    const matrixA = [
      [3, 2],
      [1, 1],
    ];
    const matrixB = [
      [1, 2],
      [3, 2],
    ];
    const expected = [
      [9, 10],
      [4, 4],
    ];
    const actual = multiply(matrixA, matrixB);
    expect(actual).toEqual(expected);
  });

  test('test #3', () => {
    const matrixA = [
      [1, 2, 1],
      [0, 1, 0],
      [2, 3, 4],
    ];
    const matrixB = [
      [2, 5],
      [6, 7],
      [1, 8],
    ];
    const expected = [
      [15, 27],
      [6, 7],
      [26, 63],
    ];
    const actual = multiply(matrixA, matrixB);
    expect(actual).toEqual(expected);
  });

  test('test #4', () => {
    const matrixA = [
      [2, 5],
      [6, 7],
      [1, 8],
    ];
    const matrixB = [
      [1, 2, 1],
      [0, 1, 0],
    ];
    const expected = [
      [2, 9, 2],
      [6, 19, 6],
      [1, 10, 1],
    ];
    const actual = multiply(matrixA, matrixB);
    expect(actual).toEqual(expected);
  });

  test('border cases', () => {
    expect(multiply([[2]], [[3]])).toEqual([[6]]);

    const matrixA = [
      [1],
      [2],
    ];

    const matrixB = [[10, 20]];

    const expected = [
      [10, 20],
      [20, 40],
    ];

    expect(multiply(matrixA, matrixB)).toEqual(expected);
  });
});
