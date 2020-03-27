import snailPath from '../solution.js';

describe('snail tests', () => {
  test('first', () => {
    const matrix1 = [
      [1, 2],
      [3, 4],
    ];
    const expected1 = [1, 2, 4, 3];
    expect(snailPath(matrix1)).toEqual(expected1);
  });

  test('second', () => {
    const matrix2 = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
    ];
    const expected2 = [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7];
    expect(snailPath(matrix2)).toEqual(expected2);
  });

  test('third', () => {
    const matrix3 = [
      [undefined, '', null],
      [true, false, 'foo'],
      [[], {}, { key: 'bar' }],
    ];
    const expected3 = [undefined, '', null, 'foo', { key: 'bar' }, {}, [], true, false];
    expect(snailPath(matrix3)).toEqual(expected3);
  });

});
