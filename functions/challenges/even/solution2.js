const isEven = (num) => num % 2 === 0;

export default (arr) => {
  const firstItemParity = isEven(arr[0]);
  return arr.filter((el) => isEven(el) === firstItemParity);
};