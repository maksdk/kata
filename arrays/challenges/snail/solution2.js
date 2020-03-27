const rotate = (matrix) => {
  const rowsCount = matrix.length;
  const [firstRow] = matrix;
  const columnsCount = firstRow.length;
  const rotated = [];

  for (let row = 0; row < columnsCount; row += 1) {
    rotated[row] = [];
    for (let column = 0; column < rowsCount; column += 1) {
      rotated[row][column] = matrix[column][columnsCount - row - 1];
    }
  }

  return rotated;
};

const snailPath = (matrix) => {
  const [head, ...tail] = matrix;
  if (matrix.length === 1) {
    return head;
  }
  return [head, snailPath(rotate(tail))].flat();
};

export default snailPath;