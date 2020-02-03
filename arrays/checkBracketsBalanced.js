const checkBracketsBalanced = expression => {
   const stack = [];
   for(const symbol of expression) {
      if (symbol === "(") {
         stack.push(symbol);
      }
      else if (!stack.pop()) {
         return false;
      }
   }
   return stack.length === 0;
};
