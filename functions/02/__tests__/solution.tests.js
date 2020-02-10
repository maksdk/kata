/* eslint-disable no-console */
import sayPrimeOrNot from '../prime';

beforeEach(() => {
    jest.spyOn(console, 'log');
});

describe('should be prime', () => {
    const numbers = [2, 3, 13];

    test.each(numbers)('test with %i', (num) => {
        sayPrimeOrNot(num);
        expect(console.log).toHaveBeenLastCalledWith('yes');
    });
});


describe('should not be prime', () => {
    const numbers = [8, 4, 1, 0, -3, 9];

    test.each(numbers)('test with %i', (num) => {
        sayPrimeOrNot(num);
        expect(console.log).toHaveBeenLastCalledWith('no');
    });
});