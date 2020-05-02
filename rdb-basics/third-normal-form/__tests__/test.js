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
      await trx.schema.dropTableIfExists('country_region_cities');
      await trx.schema.dropTableIfExists('country_regions');
      await trx.schema.dropTableIfExists('countries');
      await trx.raw(sql);

      const cities = await trx.from('country_region_cities');
      expect(cities).toHaveLength(3);
      expect(cities).toEqual( // 1
        expect.arrayContaining([ // 2
          expect.objectContaining({ // 3
            name: 'Казань',
          }),
        ]),
      );
      const city = cities.find((c) => c.name === 'Казань');
      expect(city).toEqual(expect.objectContaining({
        country_region_id: expect.any(String),
      }));

      const regions = await trx.from('country_regions').where({ id: city.country_region_id });
      expect(regions).toHaveLength(1);
      const [region] = regions;
      expect(region).toEqual(expect.objectContaining({
        country_id: expect.any(String),
      }));

      const countries = await trx.from('countries').where({ id: region.country_id });
      expect(countries).toHaveLength(1);

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
