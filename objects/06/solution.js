export default (obj, keys) => {
    const newObj = {};
    for (const key of keys) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
};