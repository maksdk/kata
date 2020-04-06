// @ts-check

import sumIntervals from '../solution.js';

test('test solution', () => {
  expect(sumIntervals([[5, 5]])).toEqual(0);

  expect(sumIntervals([[3, 10]])).toEqual(7);

  expect(sumIntervals([
    [1, 2],
    [11, 12],
  ])).toEqual(2);

  expect(sumIntervals([
    [2, 7],
    [6, 6],
  ])).toEqual(5);

  expect(sumIntervals([
    [1, 5],
    [1, 10],
  ])).toEqual(9);

  expect(sumIntervals([
    [1, 9],
    [7, 12],
    [3, 4],
  ])).toEqual(11);

  expect(sumIntervals([
    [7, 10],
    [1, 4],
    [2, 5],
  ])).toEqual(7);

  expect(sumIntervals([
    [1, 5],
    [9, 19],
    [1, 7],
    [16, 19],
    [5, 11],
  ])).toEqual(18);
});
