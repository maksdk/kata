import _ from 'lodash';

// BEGIN (write your solution here)

const isShip = (field, x, y) => {
  return field[y][x] && !field[y][x + 1]
    && (!field[y + 1] || (field[y + 1] && !field[y + 1][x]))
    && isLowerPart(field, x, y);
};

const isLowerPart = (field, x, y) => {
  if (!field[y][x - 1]) return true;
  if (!field[y + 1]) return true;
  if (field[y + 1][x - 1]) return false;
  return isLowerPart(field, x - 1, y);
};

export default (field) => {
  let shipsCount = 0;
  for (let y = 0; y < field.length; y += 1) {
    for (let x = 0; x < field.length; x += 1) {
      if (isShip(field, x, y)) {
        shipsCount += 1;
      }
    }
  }
  return shipsCount;
};
// END
