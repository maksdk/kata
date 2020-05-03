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
  try {
    await client.transaction(async (trx) => {
      await trx.raw(initSql);
      await trx.insert({ email: 'mamoa@hotmail.com', name: 'Mamoa' })
        .into('users');
      await trx.raw(sql);
      await trx.insert({ email: 'email@email.com', first_name: 'Tom', created_at: new Date() })
        .into('users');
      const mamoa = await trx.from('users').where('first_name', 'Mamoa').first();
      expect(mamoa).toEqual({
        first_name: 'Mamoa', created_at: null, id: expect.anything(), email: 'mamoa@hotmail.com',
      });
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
