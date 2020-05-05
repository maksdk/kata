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
  const initSql = await fs.readFile(`${__dirname}/../init.sql`, 'utf-8');
  const sql = await fs.readFile(`${__dirname}/../solution.sql`, 'utf-8');
  await client.raw(initSql);
  try {
    await client.transaction(async (trx) => {
      await trx.raw(sql);

      const result = await trx.from('friendship').select('user1_id', 'user2_id');
      const expected = [
        { user1_id: '2', user2_id: '7' },
        { user1_id: '7', user2_id: '2' },
      ];
      const sorter = (v1, v2) => {
        if (v1.user1_id > v2.user1_id) {
          return 1;
        }
        if (v1.user1_id < v2.user1_id) {
          return -1;
        }
        return 0;
      };
      expect(result.sort(sorter)).toEqual(expected.sort(sorter));

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
