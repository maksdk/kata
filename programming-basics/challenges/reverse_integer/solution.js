export default (number) => {
  const numbers = String(number).split('');

  if (numbers[0] === '-') {
    numbers.shift();
    return Number(numbers.reverse().join('')) * -1;
  }

  return Number(numbers.reverse().join(''))
};