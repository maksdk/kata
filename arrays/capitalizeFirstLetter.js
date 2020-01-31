//@ts-check
const capitalizeFirstLetter = str => {
    const words = str.split(" ");
    const capitalizedWords = [];
    for(const letter of words) {
        const capitalizedLetter = letter[0].toUpperCase() + letter.slice(1, letter.length);
        capitalizedWords.push(capitalizedLetter);
    }

    return capitalizedWords.join(" ");
};