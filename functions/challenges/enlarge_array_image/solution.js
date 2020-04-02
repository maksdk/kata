const largeArray = (arr) => {
  return arr.reduce((acc, elem) => [...acc, elem, elem], []);
};
export default (matrix) => {
  return matrix.reduce((acc, arr) => {
    const largedArr = largeArray(arr);
    return [...acc, largedArr, largedArr.slice()];
  },[]);
};