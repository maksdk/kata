const treeReduce = (fn, tree, acc) => {
   const [name, children]=tree;
   const newA = fn(acc, tree);
   if (!children) return newA;
   return children.reduce((initAcc, child) => treeReduce(fn, child, initAcc), newA)
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

console.log(treeReduce((acc) => acc + 1, tree, 0));