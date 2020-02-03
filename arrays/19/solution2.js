const openingSymbols = ['(', '[', '{', '<'];
const closingSymbols = [')', ']', '}', '>'];

const isOpeningSymbol = (symbol) => openingSymbols.includes(symbol);
const getClosingSymbolFor = (symbol) => closingSymbols[openingSymbols.indexOf(symbol)];

export default (str) => {
   const stack = [];
   for (const symbol of str) {
      if (isOpeningSymbol(symbol)) {
         const closingSymbol = getClosingSymbolFor(symbol);
         stack.push(closingSymbol);
      } else {
         const lastSavedSymbol = stack.pop();
         if (symbol !== lastSavedSymbol) {
            return false;
         }
      }
   }

   return stack.length === 0;
};