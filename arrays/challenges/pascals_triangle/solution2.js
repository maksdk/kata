const generateNextRow = (previousRow) => {
    const nextRow = [];

    for (let i = 0; i <= previousRow.length; i += 1) {
        const first = previousRow[i - 1] || 0;
        const second = previousRow[i] || 0;
        nextRow[i] = first + second;
    }

    return nextRow;
};

const generate = (rowNumber) => {
    let currentRow = [1];

    for (let row = 0; row < rowNumber; row += 1) {
        currentRow = generateNextRow(currentRow);
    }

    return currentRow;
};

export default generate;