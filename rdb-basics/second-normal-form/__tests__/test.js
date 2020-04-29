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
      await trx.schema.dropTableIfExists('brands');
      await trx.raw(sql);

      const cars = await trx.from('cars');
      expect(cars).toHaveLength(5);
      const [carsRecord] = cars;
      expect(carsRecord).not.toHaveProperty('discount');
      expect(carsRecord).toHaveProperty('brand_id');
      expect(carsRecord.brand_id).not.toBeNull();

      const brands = await trx.from('brands');
      expect(brands).toHaveLength(2);
      const [brandsRecord] = brands;
      expect(brandsRecord).toHaveProperty('name');
      expect(brandsRecord).toHaveProperty('discount');

      const actual = trx('cars').insert({ id: 6, brand_id: 3 });
      await expect(actual).rejects.toThrow(/insert or update on table "cars" violates foreign key constraint/);

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
