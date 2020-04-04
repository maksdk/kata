// @ts-check
/* eslint-disable no-console */

import _ from 'lodash';

const dieFaces = ['1', '2', '3', '4', '5', '6'];

export default (roundsCount, rollDie) => {
  const iter = (acc, counter) => {
    if (counter >= roundsCount) return acc;
    const face = rollDie();
    return iter({ ...acc, [face]: _.has(acc, String(face)) ? acc[face] + 1 : 1 }, counter + 1);
  };

  const acc = iter({}, 0);

  const result =  dieFaces.map((face) => {
    if (_.has(acc, face)) {
      const count = acc[face];
      return `${face}|${'#'.repeat(count)} ${count}`;
    }
    return `${face}|`
  }).join('\n');

  console.log(result)
};
