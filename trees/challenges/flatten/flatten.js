const flatten = (coll) => {
    return coll.reduce((acc, elem) =>
        Array.isArray(elem) ? [...acc, ...flatten(elem)] : [...acc, elem],
        []);
};
export default flatten;