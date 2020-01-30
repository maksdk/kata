//@ts-check
import { reduce } from '@hexlet/immutable-fs-trees';


const calculatefilesSize = (node) => reduce((acc, n) => {
    if (n.type === 'directory') {
        return acc;
    }

    return acc + n.meta.size;
}, node, 0);

const du = (node) => {
    const result = node.children.map((n) => [n.name, calculatefilesSize(n)]);
    result.sort(([, size1], [, size2]) => size2 - size1);
    return result;
};

export default du;