const convert = coll => {
    return coll.reduce((acc, elem) => {
        const [key, value] = elem;
        if (Array.isArray(value)) return {
            ...acc,
            [key]: convert(value)
        };
        return {
            ...acc,
            [key]: value
        };
    }, {});
};
export default convert;