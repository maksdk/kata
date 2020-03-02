// @ts-check

import getMirrorMatrix from '../solution';

test('mirror matrix', () => {
    const arr1 = [
        ['he', 'xl', 'et', 'io'],
        ['in', 'my', 'ha', 'rt'],
        ['fo', 're', 've', 'r'],
        ['an', 'd', 'ev', 'er'],
    ];

    const expected1 = [
        ['he', 'xl', 'xl', 'he'],
        ['in', 'my', 'my', 'in'],
        ['fo', 're', 're', 'fo'],
        ['an', 'd', 'd', 'an'],
    ];

    expect(getMirrorMatrix(arr1)).toEqual(expected1);

    const arr2 = [
        [11, 12, 13, 14, 15, 16],
        [21, 22, 23, 24, 25, 26],
        [31, 32, 33, 34, 35, 36],
        [41, 42, 43, 44, 45, 46],
        [51, 52, 53, 54, 55, 56],
        [61, 62, 63, 64, 65, 66],
    ];

    const expected2 = [
        [11, 12, 13, 13, 12, 11],
        [21, 22, 23, 23, 22, 21],
        [31, 32, 33, 33, 32, 31],
        [41, 42, 43, 43, 42, 41],
        [51, 52, 53, 53, 52, 51],
        [61, 62, 63, 63, 62, 61],
    ];

    expect(getMirrorMatrix(arr2)).toEqual(expected2);
});