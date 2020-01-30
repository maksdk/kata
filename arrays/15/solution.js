const template = "$#%!";
export default (str, stopWords) => {
    const words = str.split(" ");
    const changedWords = [];
    for (const word of words) {
        stopWords.includes(word) ?
            changedWords.push(template) :
            changedWords.push(word);
    }
    return changedWords.join(" ");
};