const mutableReverseArray = (arr) => {
   const length = arr.length;
   const middleIndex = Math.floor(length / 2);

   for(let i = 0; i < middleIndex; i++) {
      const mirrowIndex = (length - 1) - i;
      const tempElem = arr[mirrowIndex];
      arr[mirrowIndex] = arr[i];
      arr[i] = tempElem;
   }
   return arr;
};