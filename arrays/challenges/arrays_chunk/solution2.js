export default (arr, size) => {
    const nArr = [];
    for (let i = 0; i < arr.length; i += size) {
        nArr.push(arr.slice(i, i + size));
    }
    return nArr;
};