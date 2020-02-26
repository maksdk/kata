//@ts-check
const solution = str => {
    const substrings = [];
    let substring = [];

    for (let i = 0; i < str.length; i++) {
        const currLetter = str[i];
        const existingLetterIndex = substring.indexOf(currLetter);
        console.log(i)

        if (existingLetterIndex !== -1) {
            i = existingLetterIndex;
            substrings.push(substring);
            substring = [];
        }
        else {
            substring.push(currLetter);

        }
    }

    if (substring.length > 0) {
        substrings.push(substring);
    }

    return substrings
        .reduce((acc, substring) => (acc.length > substring.length ? acc : substring), [])
        .length;
};