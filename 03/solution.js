export default (arr, index, value = null) => {
   return arr[index] === undefined ? value : arr[index];
};