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

const findRoute = (start, finish, graph) => {
    const iter = (current, route) => {
        const routeToCurrent = [...route, current];

        if (current === finish) {
            return routeToCurrent;
        }

        const neighbors = graph[current];
        const filtered = neighbors.filter((n) => !routeToCurrent.includes(n));

        return filtered.reduce((acc, n) => _.concat(acc, iter(n, routeToCurrent)), []);
    };

    return iter(start, []);
};

export default (tree, start, finish) => {
    const graph = makeGraph(tree);
    return findRoute(start, finish, graph);
};