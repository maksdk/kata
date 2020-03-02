export default (numRow) => {
    const iter = (num, arr) => {
        if (num < 1) return arr;

        const prevRow = arr[arr.length - 1];
        const currRow = [1];

        for (let i = 1; i < prevRow.length; i += 1) {
            currRow[i] = prevRow[i] + prevRow[i - 1];
        }

        currRow.push(1);
        arr.push(currRow);

        return iter(num - 1, arr);
    };

    const triangle = iter(numRow, [ [ 1 ] ]);
    return triangle[numRow];
};