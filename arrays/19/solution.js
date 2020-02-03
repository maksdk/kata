const openingSymbols = ['(', '[', '{', '<'];
const closingSymbols = [')', ']', '}', '>'];

export default expr => {
   const stack = [];

   for (const symbol of expr) {
      if (openingSymbols.includes(symbol)) {
         stack.push(symbol);
         continue;
      }

      const openingSymbol = stack.pop();
      if (!openingSymbol) return false;

      const indexOpeningSymbol = openingSymbols.findIndex(v => v === openingSymbol);
      const indexClosingSymbol = closingSymbols.findIndex(v => v === symbol);
      if (indexOpeningSymbol === -1 || indexClosingSymbol === -1) return false;

      if (indexOpeningSymbol !== indexClosingSymbol) {
         return false;
      }
   }
   return stack.length === 0;
};