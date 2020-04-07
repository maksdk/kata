export default (matrix1, matrix2) => {
  const m1Rows = matrix1.length;
  const m1Cols = matrix1[0].length;

  const m2Rows = matrix2.length;
  const m2Cols = matrix2[0].length;

  const result = [];

  for (let i = 0; i < m1Rows; i += 1) {
    
    result[i] = [];

    for (let j = 0; j < m2Cols; j += 1) {

      let sum = 0;

      for (let n = 0; n < m1Cols; n += 1) {
        sum +=  matrix1[i][n] * matrix2[n][j];
      }

      result[i][j] = sum;
    }
  }

  return result;
};