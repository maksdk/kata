// @ts-check

import _ from 'lodash';

// BEGIN (write your solution here)
const makeGraph = (tree, parent) => {
  const [name, children = []] = tree;

  const neighbors = [ ...children.flat(), parent ] 
    .filter(v => v && !Array.isArray(v));

  const leafs = children
    .reduce((acc, child) => ({ ...acc, ...makeGraph(child, name) }), {});

  return { [name]: neighbors, ...leafs };
};

const renderTree = (graph, leaf) => {
  const iter = (leafName, checkedAcc) => {
    const newCheckedAcc = [...checkedAcc, leafName];
    const children = graph[leafName]
      .filter((childName) => !newCheckedAcc.includes(childName))
      .map((childName) => iter(childName, newCheckedAcc));

    return _.isEmpty(children) ? [leafName] : [leafName, children];
  };

  return iter(leaf, []);
};

export default (tree, leaf) => {
  const graph = makeGraph(tree);
  const tramsformedTree = renderTree(graph, leaf);
  return tramsformedTree;
};
// END
