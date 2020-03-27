export default (matrix) => {
  if (matrix.length === 0) return [];

  let minX = 0;
  let maxX = matrix[0].length - 1;

  let minY = 0;
  let maxY = matrix.length - 1;

  let dir = 'right';
  let done = false;

  const acc = [];

  while(!done) {
    switch(dir) {
      case 'right':
        for (let x = minX; x <= maxX; x += 1) {
          acc.push(matrix[minY][x]);
        }
        minY += 1;
        dir = 'down';
        break;

      case 'down':
        for (let y = minY; y <= maxY; y += 1) {
          acc.push(matrix[y][maxX]);
        }
        maxX -= 1;
        dir = 'left';
        break;

      case 'left':
        for (let x = maxX; x >= minX; x -= 1) {
          acc.push(matrix[maxY][x]);
        }
        maxY -= 1;
        dir = 'up';
        break;
      
      case 'up':
        for (let y = maxY; y >= minY; y -= 1) {
          acc.push(matrix[y][minX]);
        }
        minX += 1;
        dir = 'right';
        break;

      default:
        throw new Error(`Such direction: ${dir} is not supported!`);
    }
    
    if (minY > maxY || minX > maxX) {
      done = true;
    }
  }

  return acc;
};