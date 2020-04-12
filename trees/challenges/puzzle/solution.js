// @ts-check

import _ from 'lodash';

// BEGIN (write your solution here)
const makeGraph = (tree, parent) => {
  const [name, children = []] = tree;

  const neighbors = [...children.flat(), parent]
    .filter(n => n && !_.isArray(n));

  const leafs = children
    .reduce((acc, child) => ({ ...acc, ...makeGraph(child, name) }), {});
  
  return {
    [name]: neighbors,
    ...leafs
  };
};

const makeTree = (graph, leaf) => {
  const iter = (leafName, checkedAcc) => {
    const newCheckedAcc = [...checkedAcc, leafName];
    const children = graph[leafName]
      .filter((child) => !newCheckedAcc.includes(child))
      .map((child) => iter(child, newCheckedAcc));

    return _.isEmpty(children) ? [leafName] : [leafName, children];
  };
  return iter(leaf, []);
};

export default (...branches) => {
  const [[leaf]] = branches;
  const graph = branches.reduce((acc, branch) => { 
    const graph = makeGraph(branch);
    return _.mergeWith(acc, graph, (v1, v2) => _.union(v1, v2))
  }, {});
  const tree = makeTree(graph, leaf);
  return tree;
};
// END
