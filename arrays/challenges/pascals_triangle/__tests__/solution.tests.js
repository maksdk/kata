import generate from '../solution.js';

test('Pascal\'s Triangle', () => {
    expect(generate(0)).toEqual([1]);
    expect(generate(1)).toEqual([1, 1]);
    expect(generate(2)).toEqual([1, 2, 1]);
    expect(generate(3)).toEqual([1, 3, 3, 1]);
    expect(generate(7)).toEqual([1, 7, 21, 35, 35, 21, 7, 1]);
});