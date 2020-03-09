import { rotateLeft, rotateRight } from '../solution';

describe('digit matrix', () => {
    const matrix = [
        [1, 2, 3, 4, 5, 6],
        [7, 8, 9, 0, 1, 2],
        [3, 4, 5, 6, 7, 8],
        [9, 0, 1, 2, 3, 4],
    ];

    test('rotate left', () => {
        const expected = [
            [6, 2, 8, 4],
            [5, 1, 7, 3],
            [4, 0, 6, 2],
            [3, 9, 5, 1],
            [2, 8, 4, 0],
            [1, 7, 3, 9],
        ];
        expect(rotateLeft(matrix)).toEqual(expected);
    });

    test('rotate right', () => {
        const expected = [
            [9, 3, 7, 1],
            [0, 4, 8, 2],
            [1, 5, 9, 3],
            [2, 6, 0, 4],
            [3, 7, 1, 5],
            [4, 8, 2, 6],
        ];
        expect(rotateRight(matrix)).toEqual(expected);
    });
});

describe('character matrix', () => {
    const matrix = [
        ['a', 'b', 'c', 'd'],
        ['aa', 'ab', 'ac', 'ad'],
        ['e', 'f', 'g', 'h'],
    ];

    test('rotate left', () => {
        const expected = [
            ['d', 'ad', 'h'],
            ['c', 'ac', 'g'],
            ['b', 'ab', 'f'],
            ['a', 'aa', 'e'],
        ];
        expect(rotateLeft(matrix)).toEqual(expected);
    });

    test('rotate right', () => {
        const expected = [
            ['e', 'aa', 'a'],
            ['f', 'ab', 'b'],
            ['g', 'ac', 'c'],
            ['h', 'ad', 'd'],
        ];
        expect(rotateRight(matrix)).toEqual(expected);
    });
});

describe('one row matrix', () => {
    const matrix = [
        [1, 2, 3, 4, 5, 6],
    ];

    test('rotate left', () => {
        const expected = [[6], [5], [4], [3], [2], [1]];
        expect(rotateLeft(matrix)).toEqual(expected);
    });

    test('rotate right', () => {
        const expected = [[1], [2], [3], [4], [5], [6]];
        expect(rotateRight(matrix)).toEqual(expected);
    });
});

describe('one column matrix', () => {
    const matrix = [[1], [2], [3], [4], [5], [6]];

    test('rotate left', () => {
        const expected = [
            [1, 2, 3, 4, 5, 6],
        ];
        expect(rotateLeft(matrix)).toEqual(expected);
    });

    test('rotate right', () => {
        const expected = [
            [6, 5, 4, 3, 2, 1],
        ];
        expect(rotateRight(matrix)).toEqual(expected);
    });
});
