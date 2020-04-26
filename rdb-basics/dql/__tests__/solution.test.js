// import _ from 'lodash';
import { promises as fs } from 'fs';
import knex from 'knex';

let client;

beforeAll(async () => {
  const connection = {
    host: '/var/run/postgresql',
  };
  client = knex({ client: 'pg', connection });
  // client.on('query', console.log);
});

test('solution', async () => {
  const sql = await fs.readFile(`${__dirname}/../solution.sql`, 'utf-8');
  try {
    await client.transaction(async (trx) => {
      await trx.raw(sql);

      const result = await trx.raw(sql);
      const expected = [{
        first_name: 'Arya',
        email: 'arya@winter.com',
        birthday: new Date('2003-03-29'),
      },
      {
        first_name: 'Brienne',
        email: 'brienne@tarth.com',
        birthday: new Date('2001-04-04'),
      },
      {
        first_name: 'Robb',
        email: 'robb@winter.com',
        birthday: new Date('1999-11-23'),
      }];
      expect(result.rows).toEqual(expected);

      throw new Error('ignore');
    });
  } catch (e) {
    if (!e.toString().match(/ignore/)) {
      throw e;
    }
  }
});

afterAll(async () => {
  await client.destroy();
});
