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
      await trx.schema.dropTableIfExists('topics');
      await trx.schema.dropTableIfExists('users');
      await trx.raw(sql);
      const user = { username: 'ehu', email: 'ehu@gmail.com', created_at: new Date() };
      const [id] = await trx.insert(user)
        .returning('id')
        .into('users');
      console.log(id)
      await trx.insert({ user_id: id, body: 'body', created_at: new Date() })
        .into('topics');
      await expect(trx.insert(user).into('users')).rejects.toThrow(/duplicate key value violates unique constraint/);
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
