// @ts-check
/* eslint-disable no-console */

import fakerator from 'fakerator';
import displayHistogram from '../solution.js';

const getRandomFn = (seed) => {
  fakerator().seed(seed);
  return () => fakerator().random.number(1, 6);
};

test.each([32, 100, 125, 210, 9, 10, 13])(
  'test histogram with rounds count %s',
  (roundsCount) => {
    console.log = jest.fn();
    const rollDie = getRandomFn(roundsCount);
    displayHistogram(roundsCount, rollDie);
    const actual = console.log.mock.calls.join('\n');
    expect(actual).toMatchSnapshot();
  },
);