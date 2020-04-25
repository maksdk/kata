// @ts-check
import path from 'path';
import { isFile, getName, getChildren } from '@hexlet/immutable-fs-trees';

const findFilesByName = (tree, substring) => {
  const iter = (node, ancestry) => {
    if(isFile(node)) {
      if (getName(node).includes(substring)) {
        return path.join(...ancestry, getName(node));
      }
      return [];
    }

    return getChildren(node)
      .map((child) => iter(child, [...ancestry, getName(node)]));
  };
  return iter(tree, []).flat(Infinity);
};  

export default findFilesByName;


