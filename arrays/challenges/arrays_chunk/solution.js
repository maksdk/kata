export default (coll, num) => {
    const result = [];
    for (let i = 0; i < coll.length; i += 1) {
        if ((i % num) === 0) result.push([]);
        result[result.length - 1].push(coll[i]);
    }
    return result;
}