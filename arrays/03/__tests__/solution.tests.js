import get from '../solution';

it('ArraysTest', () => {
   const cities = ['moscow', 'london', 'berlin', 'porto', ''];

   const actual1 = get(cities, 0);
   expect(actual1).toBe(cities[0]);

   const actual2 = get(cities, 2, 'default');
   expect(actual2).toBe(cities[2]);

   const actual3 = get(cities, 5, false);
   expect(actual3).toBe(false);

   const actual4 = get(cities, -1, 'oops');
   expect(actual4).toBe('oops');

   const actual5 = get(cities, 5);
   expect(actual5).toBeNull();

   const actual6 = get(cities, 4);
   expect(actual6).toBe('');
});