const rotate = (matrix, direction) => {
    const rowsCount = matrix.length;
    const [firstRow] = matrix;
    const columnsCount = firstRow.length;
    const rotated = [];

    for (let row = 0; row < columnsCount; row += 1) {
        rotated[row] = [];
        for (let column = 0; column < rowsCount; column += 1) {
            rotated[row][column] = direction === 'left'
                ? matrix[column][columnsCount - row - 1]
                : matrix[rowsCount - column - 1][row];
        }
    }

    return rotated;
};

export const rotateLeft = (matrix) => rotate(matrix, 'left');

export const rotateRight = (matrix) => rotate(matrix, 'right');