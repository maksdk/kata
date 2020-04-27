import { promises as fs } from 'fs';
import knex from 'knex';

let client;

beforeAll(async () => {
  const connection = {
    host: '/var/run/postgresql',
  };
  client = knex({ client: 'pg', connection });
});

test('solution', async () => {
  const initSql = await fs.readFile(`${__dirname}/../init.sql`, 'utf-8');
  const sql = await fs.readFile(`${__dirname}/../solution.sql`, 'utf-8');
  await client.raw(initSql);
  try {
    await client.transaction(async (trx) => {
      await trx.schema.dropTableIfExists('cars');
      await trx.raw(sql);

      const users = await trx.from('users');
      expect(users).toHaveLength(2);

      const cars = await trx.from('cars');
      expect(cars).toHaveLength(5);

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
