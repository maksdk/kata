const getProperty = (obj, keys) => {
    const iter = (obj, keys, count) => {
        if (count === keys.length) return obj;

        if (obj.hasOwnProperty(keys[count])) {
            return iter(obj[keys[count]], keys, count + 1);
        }
        return null;
    };
    return iter(obj, keys, 0);
};
export default getProperty;