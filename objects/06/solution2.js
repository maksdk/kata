export default (data, keys) => {
    const result = {};
    const dataKeys = Object.keys(data);

    for (const key of keys) {
        if (dataKeys.includes(key)) {
            result[key] = data[key];
        }
    }

    return result;
};