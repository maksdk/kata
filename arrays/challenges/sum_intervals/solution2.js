const sumIntervals = (intervals) => {
  const values = [];
  for (const [start, end] of intervals) {
    for (let i = start; i < end; i += 1) {
      if (!values.includes(i)) {
        values.push(i);
      }
    }
  }
  return values.length;
};

export default sumIntervals;