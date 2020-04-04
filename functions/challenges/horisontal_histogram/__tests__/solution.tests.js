
  test('test #2', () => {
    const expected = [
      '1|####################### 23',
      '2|################## 18',
      '3|############# 13',
      '4|#################### 20',
      '5|############ 12',
      '6|############## 14',
    ].join('\n');

    const roundsCount = 100;
    const rollDie = getRandomFn(roundsCount);
    play(roundsCount, rollDie);
    const actual = console.log.mock.calls.join('\n');
    expect(actual).toEqual(expected);
  });

  test('test #3', () => {
    const expected = [
      '1|############################################ 44',
      '2|########################### 27',
      '3|############################################## 46',
      '4|############################ 28',
      '5|#################################### 36',
      '6|############################# 29',
    ].join('\n');

    const roundsCount = 210;
    const rollDie = getRandomFn(roundsCount);
    play(roundsCount, rollDie);
    const actual = console.log.mock.calls.join('\n');
    expect(actual).toEqual(expected);
  });

  test('test histogram with side without value #1', () => {
    const expected = [
      '1|',
      '2|## 2',
      '3|# 1',
      '4|## 2',
      '5|#### 4',
      '6|#### 4',
    ].join('\n');

    const roundsCount = 13;
    const rollDie = getRandomFn(roundsCount);
    play(roundsCount, rollDie);
    const actual = console.log.mock.calls.join('\n');
    expect(actual).toEqual(expected);
  });

  test('test histogram with side without value #2', () => {
    const expected = [
      '1|# 1',
      '2|# 1',
      '3|### 3',
      '4|## 2',
      '5|### 3',
      '6|',
    ].join('\n');

    const roundsCount = 10;
    const rollDie = getRandomFn(roundsCount);
    play(roundsCount, rollDie);
    const actual = console.log.mock.calls.join('\n');
    expect(actual).toEqual(expected);
  });

  test('test histogram with side without value #3', () => {
    const expected = [
      '1|#### 4',
      '2|# 1',
      '3|### 3',
      '4|# 1',
      '5|',
      '6|',
    ].join('\n');

    const roundsCount = 9;
    const rollDie = getRandomFn(roundsCount);
    play(roundsCount, rollDie);
    const actual = console.log.mock.calls.join('\n');
    expect(actual).toEqual(expected);
  });