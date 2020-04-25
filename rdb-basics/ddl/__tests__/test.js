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
  const sql = await fs.readFile(`${__dirname}/../solution.sql`, 'utf-8');
  try {
    await client.transaction(async (trx) => {
      await trx.schema.dropTableIfExists('courses');
      await trx.schema.dropTableIfExists('users');
      await trx.schema.dropTableIfExists('course_members');
      await trx.raw(sql);
      await trx.insert({ name: 'ehu', body: 'lala', created_at: new Date() })
        .into('courses');
      await trx.insert({ first_name: 'Mila', email: 'mila@example.com', manager: true })
        .into('users');
      await trx.insert({ user_id: 3, course_id: 4, created_at: new Date() })
        .into('course_members');
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
