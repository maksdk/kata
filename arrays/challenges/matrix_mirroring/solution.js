// @ts-check
export default (matrix) => {
    return matrix.reduce((acc, row) => {
        const halfRow = row.slice(0, Math.floor(row.length / 2));
        const reverseHalfRow = halfRow.slice().reverse();

        return [...acc, [...halfRow, ...reverseHalfRow]];
    }, []);
};