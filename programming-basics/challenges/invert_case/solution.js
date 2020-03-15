export default (str) => {
  return str
    .split('')
    .reduce((acc, letter) => {
      const upperCaseLetter = letter.toUpperCase();
      if (upperCaseLetter === letter) {
        return [...acc, letter.toLowerCase()];
      }
      return [...acc, upperCaseLetter];
    }, [])
    .join('');
};