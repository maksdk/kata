//@ts-check
const  clone = (arr=[]) => {
    return arr.map(v => Array.isArray(v) ? clone(v) : v);
};

const transformer = (tree, rootName) => {
    const iter = (tree, name) => {
        let treeName = tree[0];
        let treeBody = tree[1] || [];
        let brench = null;

        if (treeName === name) brench = tree;

        for (let i = 0; !brench  &&  i < treeBody.length; i++) {
            
            brench = iter(treeBody[i], name);
            
            if (brench) {
                let newRoot = treeBody[i];
                treeBody.splice(i, 1);
                if (newRoot.length < 2) newRoot.push([]);
                newRoot[1].push(tree);
            }
        }

        return brench;
    };

    return iter(clone(tree), rootName);
};
export default transformer;