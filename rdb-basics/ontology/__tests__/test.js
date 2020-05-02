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
      await trx.schema.dropTableIfExists('order_items');
      await trx.schema.dropTableIfExists('orders');
      await trx.schema.dropTableIfExists('goods');
      await trx.raw(sql);

      const user = await trx.insert({ first_name: 'stranger', email: 'str@email.com' }).into('users');
      const good = await trx.insert({ name: 'iron', price: 100 }).into('goods');
      const order = await trx.insert({ user_id: user.id }).into('orders');
      await trx.insert({ order_id: order.id, good_id: good.id, price: good.price }).into('order_items');

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
