//@ts-check
import {
   mkdir,
   mkfile
} from '@hexlet/immutable-fs-trees';

const tree = mkdir('/', [
   mkdir('etc', [
      mkdir('apache'),
      mkdir('nginx', [
         mkfile('nginx.conf'),
      ]),
   ]),
   mkdir('consul', [
      mkfile('config.json'),
      mkfile('file.tmp'),
      mkdir('data'),
   ]),
   mkfile('hosts'),
   mkfile('resolve'),
]);

const reduce = (fn, node, acc) => {
   const {
      type,
      children
   } = node;
   const newAcc = fn(node, acc);
   if (type === "file") return newAcc;
   return children.reduce((initAcc, child) => reduce(fn, child, initAcc), acc);
};
debugger

const countFiles = reduce((node, acc) => node.type === 'file' ? acc + 1 : acc, tree, 0);
console.log(countFiles)
console.log(tree)