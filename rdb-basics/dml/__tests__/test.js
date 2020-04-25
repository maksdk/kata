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

      const arya = await trx.from('users').where({ email: 'arya@winter.com' }).first();
      expect(arya).toMatchObject({ first_name: 'Arya', manager: null });
      const tirion = await trx.from('users').where({ email: 'tirion@got.com' }).first();
      expect(tirion).toMatchObject({ first_name: 'Tirion', manager: true });
      const sansa = await trx.from('users').where({ first_name: 'Sansa' }).first();
      expect(sansa).toBeUndefined();

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
