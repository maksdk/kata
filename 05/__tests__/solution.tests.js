import _ from 'lodash';
import swap from '../solution';

describe('swap', () => {
   it('to equal', () => {
      const names = ['john', 'smith', 'karl'];
      expect(swap(_.clone(names), 0)).toEqual(names);
      expect(swap(_.clone(names), 2)).toEqual(names);
      expect(swap(_.clone(names), 1)).toEqual(_.clone(names).reverse());
   });

   it('to equal with false', () => {
      const names = ['john', 'smith', false];
      expect(swap(_.clone(names), 1)).toEqual(_.clone(names).reverse());
   });

   it('to equal with undefined', () => {
      const names = ['john', 'smith', undefined];
      expect(swap(_.clone(names), 1)).toEqual(_.clone(names).reverse());
   });

   it('to equal with 0', () => {
      const names = ['john', 'smith', 0];
      expect(swap(_.clone(names), 1)).toEqual(_.clone(names).reverse());
   });

   it('to equal with empty string', () => {
      const names = ['john', 'smith', ''];
      expect(swap(_.clone(names), 1)).toEqual(_.clone(names).reverse());
   });

   it('to equal with null', () => {
      const names = ['john', 'smith', null];
      expect(swap(_.clone(names), 1)).toEqual(_.clone(names).reverse());
   });
});