import _ from 'lodash';

export default (roundsCount, rollDie) => {
  const bar = '#';
  const numbers = _.times(roundsCount, rollDie);
  const sides = _.range(1, 7);

  const lines = sides.map((side) => {
    const count = numbers.filter((number) => number === side).length;
    const displayCount = count !== 0 ? ` ${count}` : '';
    return `${side}|${bar.repeat(count)}${displayCount}`;
  });
  const str = lines.join('\n');

  console.log(str);
};