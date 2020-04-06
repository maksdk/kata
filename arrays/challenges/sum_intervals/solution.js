export default (intervals) => {
  const acc = [];

  for (const interval of intervals) {
    const [first, last] = interval;
    if (first === last) continue;

    for (let i = first + 1; i <= last; i += 1) {
      if (!acc.includes(i))  {
        acc.push(i);
      }
    }
  }
  
  return acc.length;
};