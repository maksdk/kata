//@ts-check
import {
   mkdir,
   mkfile,
   reduce 
} from '@hexlet/immutable-fs-trees';

const tree = mkdir('/', [
   mkdir('etc', [
      mkdir('apache'),
      mkdir('nginx', [
         mkfile('nginx.conf'),
      ]),
      mkdir('consul', [
         mkfile('config.json'),
         mkdir('data'),
      ]),
   ]),
   mkfile('hosts'),
   mkfile('resolve'),
]);

const dirs = reduce((acc, node) => {
   if (node.type === "directory" && node.children.length === 0) return [ ...acc, node.name ];
   return acc;
}, tree, []);

console.log(dirs);


const findEmptyDirsDepth = (tree, depth=1) => {

   const iter = (node, currDepth, acc) => {
      if (currDepth > depth || node.type === 'file') {
         return acc;
      }

      if (node.children.length === 0) {
         return [...acc, node.name ];
      }

      return node.children
         .reduce((initAcc, child) => iter(child, currDepth + 1, initAcc), acc);
   };

   return iter(tree, 0, []);
};

console.log(findEmptyDirsDepth(tree, 2));