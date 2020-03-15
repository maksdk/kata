const reverseInt = (num) => {
  const numAsStr = String(Math.abs(num));
  let reversedStr = '';

  for (let i = numAsStr.length - 1; i >= 0; i -= 1) {
    reversedStr += numAsStr[i];
  }
  const reversedModule = Number(reversedStr);

  return num < 0 ? -reversedModule : reversedModule;
};

export default reverseInt;