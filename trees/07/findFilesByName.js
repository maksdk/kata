//@ts-check
import path from 'path';

export default function findFilesByName(root, subst) {

   const iter = (node, ancestry, acc) => {
      const newAcentry = ancestry ? path.join(ancestry, node.name) : node.name;

      if (node.type === "file") {
         return node.name.includes(subst) ? [ ...acc, newAcentry ] : acc;
      }

      return node.children.reduce((initAcc, child) => iter(child, newAcentry, initAcc), acc);
   };

   return iter(root, "", []);
};