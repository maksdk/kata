// import lengthOfLastWord from '../solution1.js/index.js';
import lengthOfLastWord from '../solution2.js/index.js';

test('length of last word', () => {
    expect(lengthOfLastWord('')).toBe(0);
    expect(lengthOfLastWord('hi')).toBe(2);
    expect(lengthOfLastWord('man in black')).toBe(5);
    expect(lengthOfLastWord('hello, world!')).toBe(6);
    expect(lengthOfLastWord('hello, wOrLD!  ')).toBe(6);
});