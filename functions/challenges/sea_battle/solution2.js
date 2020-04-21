const getUsedSpace = (battleField) => battleField
  .reduce((acc, line) => acc + line.filter((item) => item === 1).length, 0);

const calcShipsCount = (battleField) => {
  let bigShipsCount = 0;
  let bigShipsSpace = 0;
  [battleField, _.zip(...battleField)].forEach((field) => field.forEach((line) => {
    const bigShips = line.join('').split(0).filter((ship) => ship.length > 1);
    bigShipsCount += bigShips.length;
    bigShipsSpace += bigShips.reduce((acc, bigShip) => acc + bigShip.length, 0);
  }));
  const smallShipsCount = getUsedSpace(battleField) - bigShipsSpace;
  return bigShipsCount + smallShipsCount;
};

export default calcShipsCount;