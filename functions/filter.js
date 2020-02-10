const myFilter = (arr, cb) => {
    const result = [];
    for(const elem of arr) {
        if (cb(elem)) result.push(elem);
    }
    return result;
};