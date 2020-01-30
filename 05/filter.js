//@ts-check
export default function filter(fn, tree) {
   if (!fn(tree)) return null;

   const {
      type,
      children
   } = tree;

   if (type === 'file') return tree;
   return {
      ...tree,
      children: children.map(child => filter(fn, child))
                        .filter(v => v)
   };
}