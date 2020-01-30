export default coll => {
    if (coll.length === 0) return [];

    const result = [];
    const firstElem = Math.abs(coll[0] % 2);

    for (const value of coll) {
        if (Math.abs(value % 2) === firstElem) {
            result.push(value);
        }
    }
    return result;
};