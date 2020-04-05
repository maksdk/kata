import _ from 'lodash';

export default (roundsCount, rollDie) => {
  const bar = '###';
  const width = 4;
  const numbers = _.times(roundsCount, rollDie);
  const sides = _.range(1, 7);
  const counts = _.countBy(numbers);
  const countsPairs = _.toPairs(counts);
  const [, maxCount] = _.maxBy(countsPairs, ([, count]) => count);
  const percentsPairs = countsPairs.map(([side, count]) => {
    const percent = Math.round((count * 100) / roundsCount);
    return [side, percent];
  });
  const percents = _.fromPairs(percentsPairs);

  const lines = [];
  for (let i = maxCount; i > -1; i -= 1) {
    const chunks = sides.map((side) => {
      let chunk;
      const count = _.get(counts, side, 0);
      if (count > i) {
        chunk = bar.padEnd(width);
      } else if (count === i && count !== 0) {
        const percent = percents[side];
        chunk = `${percent}%`.padEnd(width);
      } else {
        chunk = ' '.repeat(width);
      }
      return chunk;
    });
    const line = _.trimEnd(chunks.join(''));
    lines.push(line);
  }
  lines.push('-'.repeat(width * sides.length).slice(0, -1));
  const lineWithSides = sides.map((side) => ` ${side} `.padEnd(width)).join('');
  lines.push(_.trimEnd(lineWithSides));

  const str = lines.join('\n');
  console.log(str);
};