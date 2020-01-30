const treeFilter = (fn, tree) => {
   if (!fn(tree)) return null;

   const [name, children] = tree;

   if (!children) return [ name ];
   return [name, children.map(child => treeFilter(fn, child)).filter(v => v)]
};

 
 const tree = ['a', [
   ['B', [['e'], ['F']]],
   ['C'],
   ['d', [['G'], ['j']]],
 ]];
 
 const result = treeFilter(([name]) => name === name.toLowerCase(), tree);
 
console.log( JSON.stringify(result));