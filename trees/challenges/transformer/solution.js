import _ from 'lodash';

// BEGIN
const makeGraph = (tree, parent, leafs = {}) => {
    const [leaf, children] = tree;

    if (!children) {
        return {
            ...leafs,
            [leaf]: [parent]
        };
    }

    const flatChildren = _.flatten(children);
    const neighbors = [...flatChildren, parent]
        .filter((n) => n && !_.isArray(n));

    return {
        ...leafs,
        [leaf]: neighbors,
        ...children.reduce((acc, c) => ({
            ...acc,
            ...makeGraph(c, leaf)
        }), {}),
    };
};

const buildTreeFromLeaf = (graph, leaf) => {
  
    const iter = (current, acc) => {
        const checked = [...acc, current];
        const neighbors = graph[current]
            .filter((n) => !checked.includes(n))
            .map((n) => iter(n, checked));
        return _.isEmpty(neighbors) ? [current] : [current, neighbors];
    };

    return iter(leaf, []);
};

const transform = (tree, leaf) => {
    const graph = makeGraph(tree);
    return buildTreeFromLeaf(graph, leaf);
};