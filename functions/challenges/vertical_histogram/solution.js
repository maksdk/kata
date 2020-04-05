// @ts-check
import _ from 'lodash';

const createFaces = (roundsCount, rollDie) => {
  const throws = _.times(roundsCount, rollDie);
  return _.range(1, 7)
    .map(face => {
      const count = throws.reduce((acc, val) => (val == face ? acc + 1 : acc), 0);
      const persent = Math.round((count / roundsCount) * 100);
      return { face, persent, count };
    });
};

const strinfifyBottom = (faces) => {
  const line = '-'.repeat((faces.length * 3) + faces.length - 1);
  const numbers = faces.map(({face}) => ` ${face} `)
    .join(' ')
    .trimRight();
    
  return [line, numbers];
};

const preperaColumns = (faces) => {
  return faces.map(({ face, persent, count }) => {
    if (count > 0) {
      return [`${persent}%`.padEnd(3, ' '),  ...new Array(count).fill('###')];
    }
    return [];
  })
  .map(column => column.reverse());
};

const stringifyColumns = (columns) => {
  let counter = 0;
  let done = false;
  const acc = [];

  while(!done) {
    const temp = [];
    done = true;

    columns.forEach((column) => {
      if (column[counter]) {
        temp.push(column[counter]);
        done = false;
        return;
      }
      temp.push('   ');
    });
    
    if (done) break;
    
    acc.push(temp);
    counter += 1;
  }
  
  return acc.reverse().map(elem => elem.join(' ').trimRight());
};

const createHistogram = (roundsCount, rollDie) => {
  const faces = createFaces(roundsCount, rollDie);

  const columns = preperaColumns(faces);
  const strinfifiedColumns = stringifyColumns(columns);

  const bottom = strinfifyBottom(faces);

  const output =  [...strinfifiedColumns, ...bottom].join('\n');

  console.log(output)
};

createHistogram(100, () => Math.ceil(Math.random() * 6) );