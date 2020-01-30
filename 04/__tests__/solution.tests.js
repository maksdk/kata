import addPrefix from '../solution';

it('addPrefix', () => {
   const names = ['john', 'smith', 'karl'];

   const actual1 = addPrefix(names, 'Mr');
   const expected1 = ['Mr john', 'Mr smith', 'Mr karl'];
   expect(actual1).toEqual(expected1);

   const actual2 = addPrefix(names, 'Mrs');
   const expected2 = ['Mrs john', 'Mrs smith', 'Mrs karl'];
   expect(actual2).toEqual(expected2);
});