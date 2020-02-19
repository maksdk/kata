const getRangeOfSequence = (sequence) => {
    const first = sequence[0];
    const last = sequence[sequence.length - 1];
    return `${first}->${last}`;
};

const summaryRanges = (numbers) => {
    const ranges = [];
    let sequence = [];

    for (let index = 0; index < numbers.length; index += 1) {
        const current = numbers[index];
        const next = numbers[index + 1];
        sequence.push(current);
        if (current + 1 !== next) {
            if (sequence.length > 1) {
                const range = getRangeOfSequence(sequence);
                ranges.push(range);
            }
            sequence = [];
        }
    }

    return ranges;
};

export default summaryRanges;