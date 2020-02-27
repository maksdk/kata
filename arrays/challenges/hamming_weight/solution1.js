export default num => {
    const matches = num.toString(2).match(RegExp('1', 'g'));
    return matches ? matches.length : 0;
};