const treeMap = (fn, tree) => {
   const [, children] = tree;
   const [newName] = fn(tree);

   if (!children) return [newName];
   return [newName, children.map(child => treeMap(fn, child))];
};

const tree = ['A', [
   ['B', [
      ['E'],
      ['F']
   ]],
   ['C'],
   ['D', [
      ['G'],
      ['J']
   ]],
]];

console.log(JSON.stringify(treeMap(([name]) => [name.toLowerCase()], tree)));