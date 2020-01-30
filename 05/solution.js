const swap = (arr, index) => {
   const beforeIndex = index - 1;
   const afterIndex = index + 1;

   if (beforeIndex < 0 || beforeIndex > arr.length - 1) return arr;
   if (afterIndex < 0 || afterIndex > arr.length - 1) return arr;

   const temptElem = arr[beforeIndex];
   arr[beforeIndex] = arr[afterIndex];
   arr[afterIndex] = temptElem;

   return arr;
};
export default swap;