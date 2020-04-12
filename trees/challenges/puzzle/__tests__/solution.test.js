// @ts-check

import { sortTree } from '@hexlet/graphs';
import combine from '../puzzle.js';

describe('combine', () => {
  const branch1 = ['A', [
    ['B', [
      ['C'],
      ['D'],
    ]],
  ]];

  const branch2 = ['B', [
    ['D', [
      ['E'],
      ['F'],
    ]],
  ]];

  const branch3 = ['I', [
    ['A', [
      ['B', [
        ['C'],
        ['H'],
      ]],
    ]],
  ]];

  it('#test1', () => {
    const expected = ['A', [
      ['B', [
        ['C'],
        ['D', [
          ['E'],
          ['F'],
        ]],
        ['H'],
      ]],
      ['I'],
    ]];

    const actual = combine(branch1, branch2, branch3);
    expect(sortTree(actual)).toEqual(expected);
  });

  it('#test2', () => {
    const expected = ['B', [
      ['A', [
        ['I'],
      ]],
      ['C'],
      ['D', [
        ['E'],
        ['F'],
      ]],
      ['H'],
    ]];

    const actual = combine(branch2, branch1, branch3);
    expect(sortTree(actual)).toEqual(expected);
  });

  it('#test3', () => {
    const expected = ['I', [
      ['A', [
        ['B', [
          ['C'],
          ['D', [
            ['E'],
            ['F'],
          ]],
          ['H'],
        ]],
      ]],
    ]];

    const actual = combine(branch3, branch2, branch1);
    expect(sortTree(actual)).toEqual(expected);
  });

  it('#test4', () => {
    const expected = ['B', [
      ['A', [
        ['I'],
      ]],
      ['C'],
      ['D', [
        ['E'],
        ['F'],
      ]],
      ['H'],
    ]];

    const actual = combine(branch2, branch3);
    expect(sortTree(actual)).toEqual(expected);
  });
});
