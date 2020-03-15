// @ts-check

const sumSquareDifference = (n) => {
  const iter = (number, sum1, sum2) => {
    if (number <= 0) return sum1 ** 2 - sum2;
    return iter(number - 1, sum1 + number, sum2 + number ** 2);
  };
  return iter(n, 0, 0);
};

export default sumSquareDifference;