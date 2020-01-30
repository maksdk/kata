//@ts-check
export default function reduce(fn, tree, acc) {
   const { type, children } = tree;
   const newAcc = fn(acc, tree);

   if (type === 'file') return newAcc;
   return children.reduce( (initAcc, child) => reduce(fn, child, initAcc), newAcc);
};