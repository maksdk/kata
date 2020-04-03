const isAnagrams = (w1, w2) => {
    if (w1.length !== w2.length) return false;
    return w1.split('').sort().join('') === w2.split('').sort().join('');
};

export default (expresion, words) => {
    return words.filter(word => isAnagrams(expresion, word));
};