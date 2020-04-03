export default (word, words) => {
    const normalize = (str) => [...str].sort().join('');
    const normal = normalize(word);

    return words.filter((item) => normalize(item) === normal);
};