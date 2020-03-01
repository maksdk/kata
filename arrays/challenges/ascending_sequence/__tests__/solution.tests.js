import isContinuousSequence from '../arrays.js';

describe('getSameCount', () => {
    it('#should be false', () => {
        expect(isContinuousSequence([])).toBeFalsy();
        expect(isContinuousSequence([7])).toBeFalsy();
        expect(isContinuousSequence([5, 3, 2, 8])).toBeFalsy();
        expect(isContinuousSequence([10, 11, 12, 14, 15])).toBeFalsy();
        expect(isContinuousSequence([10, 11, 11, 12])).toBeFalsy();
    });

    it('#should be true', () => {
        expect(isContinuousSequence([0, 1, 2, 3])).toBeTruthy();
        expect(isContinuousSequence([-5, -4, -3])).toBeTruthy();
        expect(isContinuousSequence([10, 11, 12, 13])).toBeTruthy();
    });
});
