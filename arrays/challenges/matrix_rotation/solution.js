//@ts-check
const rotateLeft = (matrix) => {
    if (matrix.length === 0) return [];

    const result = [];
    const rows = matrix[0].length;
    const cols = matrix.length;

    for (let y = rows - 1; y >= 0; y -= 1) {
        result.push([]);

        for (let x = 0; x < cols; x += 1) {
            const row = result[result.length - 1];
            row[x] = matrix[x][y];
        }
    }

    return result;
};

const rotateRight = (matrix) => {
    if (matrix.length === 0) return [];

    const result = [];
    const rows = matrix[0].length;
    const cols = matrix.length;

    for (let y = 0; y < rows; y += 1) {
        result.push([]);
        for (let x = cols - 1; x >= 0; x -= 1) {
            const row = result[result.length - 1];
            row.push(matrix[x][y]);
        }
    }

    return result;
};

export { rotateLeft, rotateRight };
