// @ts-check
const isEven = (val) => val % 2 === 0;

export default (coll) => {
  const [firstNum] = coll;

  const func = isEven(firstNum) ?
    (val) => isEven(val) :
    (val) => !isEven(val);

  return coll.filter(func);
};