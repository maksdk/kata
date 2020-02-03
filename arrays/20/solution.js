export default (coll1, coll2) => {
    let count1 = 0;
    let count2 = 0;
    const result = [];

    while (count1 < coll1.length && count2 < coll2.length) {
        const value1 = coll1[count1];
        const value2 = coll2[count2];

        if (value1 === value2) {
            result.push(value1);
            count1 += 1;
            count2 += 1;
        } else if (value1 > value2) {
            count2 += 1;
        } else {
            count1 += 1;
        }
    }

    return result;
};