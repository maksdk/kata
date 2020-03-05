import isPalindrome from '../solution';

test('isPalindrome', () => {
    expect(isPalindrome('a')).toBe(true);
    expect(isPalindrome('aa')).toBe(true);
    expect(isPalindrome('404')).toBe(true);
    expect(isPalindrome('abba')).toBe(true);
    expect(isPalindrome('radar')).toBe(true);
    expect(isPalindrome('absba')).toBe(true);
    expect(isPalindrome('aibohphobia')).toBe(true);

    expect(isPalindrome('abaoba')).toBe(false);
    expect(isPalindrome('aashgkhdj')).toBe(false);
    expect(isPalindrome('palindrome')).toBe(false);
    expect(isPalindrome('aibohapohobia')).toBe(false);
});