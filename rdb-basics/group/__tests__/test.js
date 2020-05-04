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
      const expected = [
        { count: '1', year_of_birthday: 1975 },
        { count: '3', year_of_birthday: 1999 },
        { count: '1', year_of_birthday: 2001 },
        { count: '1', year_of_birthday: 2003 },
      ];
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
