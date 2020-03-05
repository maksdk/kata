const isPalindrome = (str) => {
    const size = str.length;
    if (size < 2) return true;

    if (str[0] !== str[size - 1]) return false;

    return isPalindrome(str.substring(1, size - 1));;
};

export default isPalindrome;