export default (deps) => {
    const add = (acc, node) => {
        const subDeps = deps[node] || [];
        const subAcc = subDeps.reduce(add, []);
        return {
            ...acc,
            ...subAcc,
            [node]: true
        };
    };
    const set = Object.keys(deps).reduce(add, {});
    return Object.keys(set);
};