//@ts-check
export default function map(fn, tree) {
   const {
      type,
      children,
      meta
   } = tree;
   const {
      name: newName
   } = fn(tree);
   if (type === 'file') return {
      type,
      name: newName,
      meta
   };
   return {
      name: newName,
      meta,
      type,
      children: children.map(child => map(fn, child))
   }
};

const map2 = (f, node) => {
   const updatedNode = f(node);

   return node.type === 'directory' ?
      {
         ...updatedNode,
         children: node.children.map((n) => map2(f, n))
      } : updatedNode;
};