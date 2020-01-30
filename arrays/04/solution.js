export default (arr, prefix) => {
   const result = [];
   for (let i = 0; i < arr.length; i++) {
      result[i] = `${prefix} ${arr[i]}`;
   }
   return result;
};