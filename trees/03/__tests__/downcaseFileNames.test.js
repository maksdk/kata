//@ts-check
import {
   cloneDeep
} from 'lodash';
import {
   mkdir,
   mkfile
} from '@hexlet/immutable-fs-trees';
import downcaseFileNames from '../downcaseFileNames';

describe('should', () => {
   test('be immutable', () => {
      const tree = mkdir('/', [
         mkdir('eTc', [
            mkdir('NgiNx'),
            mkdir('CONSUL', [
               mkfile('config.json'),
            ]),
         ]),
         mkfile('hOsts'),
      ]);
      const original = cloneDeep(tree);

      downcaseFileNames(tree);

      expect(tree).toEqual(original);
   });

   test('downcase file names', () => {
      const tree = mkdir('/', [
         mkdir('eTc', [
            mkdir('NgiNx'),
            mkdir('CONSUL', [
               mkfile('config.JSON'),
            ]),
         ]),
         mkfile('hOsts'),
      ]);
      const actual = downcaseFileNames(tree);

      const expected = {
         children: [{
               children: [{
                     children: [],
                     meta: {},
                     name: 'NgiNx',
                     type: 'directory',
                  },
                  {
                     children: [{
                        meta: {},
                        name: 'config.json',
                        type: 'file'
                     }],
                     meta: {},
                     name: 'CONSUL',
                     type: 'directory',
                  },
               ],
               meta: {},
               name: 'eTc',
               type: 'directory',
            },
            {
               meta: {},
               name: 'hosts',
               type: 'file'
            },
         ],
         meta: {},
         name: '/',
         type: 'directory',
      };

      expect(actual).toEqual(expected);
   });

   test('return full copy', () => {
      const tree = mkdir('/', [
         mkdir('eTc', [
            mkdir('NgiNx', [], {
               size: 4000
            }),
            mkdir('CONSUL', [
               mkfile('config.JSON', {
                  uid: 0
               }),
            ]),
         ]),
         mkfile('hOsts'),
      ]);
      const actual = downcaseFileNames(tree);

      const expected = {
         children: [{
               children: [{
                     children: [],
                     meta: {
                        size: 4000
                     },
                     name: 'NgiNx',
                     type: 'directory',
                  },
                  {
                     children: [{
                        meta: {
                           uid: 0
                        },
                        name: 'config.json',
                        type: 'file'
                     }],
                     meta: {},
                     name: 'CONSUL',
                     type: 'directory',
                  },
               ],
               meta: {},
               name: 'eTc',
               type: 'directory',
            },
            {
               meta: {},
               name: 'hosts',
               type: 'file'
            },
         ],
         meta: {},
         name: '/',
         type: 'directory',
      };

      expect(actual).toEqual(expected);
   });
});