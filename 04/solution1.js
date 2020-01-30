const dfs = (tree) => {
   const [name, children = []] = tree;
   if (children.lenght === 0) return [name.toLowerCase()];
   return [name.toLowerCase(), children.map(dfs)]
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

console.log(JSON.stringify(dfs(tree)));