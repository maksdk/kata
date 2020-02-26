const getLongestLength = (str) => {
    let sequence = [];
    let maxLength = 0;

    for (const char of str) {
        const index = sequence.indexOf(char);
        sequence.push(char);
        if (index !== -1) {
            sequence = sequence.slice(index + 1);
        }
        const sequenceLength = sequence.length;
        if (sequenceLength > maxLength) {
            maxLength = sequenceLength;
        }
    }

    return maxLength;
};

export default getLongestLength;