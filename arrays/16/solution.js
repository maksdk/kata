export default (coll1, coll2) => {
    let countUniqElems = 0;
    const uniqColl1 = uniq(coll1);
    const uniqColl2 = uniq(coll2);

    for (const value1 of uniqColl1) {
        for (const value2 of uniqColl2) {
            if (value1 === value2) {
                countUniqElems += 1;
            }
        }
    }
    return countUniqElems;
};

function uniq(coll) {
    const result = [];
    for (const value of coll) {
        if (!includes(result, value)) {
            result.push(value);
        }
    }
    return result;
}

function includes(coll, elem) {
    for (const value of coll) {
        if (value === elem) return true;
    }
    return false;
}