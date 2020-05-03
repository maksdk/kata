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
        'Arya',
        'Brienne',
        'Robb',
        'Sansa',
        'Jon',
        'Tirion',
        'Daenerys',
      ];
      // eslint-disable-next-line
      expect(result.rows.map(({ first_name }) => first_name)).toEqual(expected);

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
