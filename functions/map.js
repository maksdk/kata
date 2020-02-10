const myMap = (arr, cb) => {
    const result = [];
    for(const value of arr) {
        const newValue = cb(value);
        result.push(newValue);
    }
    return result;
};