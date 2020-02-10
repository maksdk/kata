const myReduce = (arr, cb, init) => {
    let acc = init;
    for(const elem of arr) {
        acc = cb(acc, elem);
    }
    return acc;
};