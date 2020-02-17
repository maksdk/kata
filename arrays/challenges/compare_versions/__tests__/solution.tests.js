import compareVersion from '../solution.js';

test('compare version', () => {
    expect(compareVersion('0.1', '0.2')).toBe(-1);
    expect(compareVersion('0.2', '0.1')).toBe(1);
    expect(compareVersion('4.2', '4.2')).toBe(0);
    expect(compareVersion('0.2', '0.12')).toBe(-1);
    expect(compareVersion('3.2', '4.12')).toBe(-1);
    expect(compareVersion('3.2', '2.12')).toBe(1);
});