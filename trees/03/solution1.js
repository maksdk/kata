const dfs = (tree) => {
   const [name, children=[]] = tree;
   if (children.length === 0) return;
   return children.map(dfs);
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


console.log(dfs(tree))