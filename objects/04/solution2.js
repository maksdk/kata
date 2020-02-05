const getIn = (obj, keys) => {
    let current = obj;
    for(const key of keys) {
        if (!current.hasOwnProperty(key)) {
            return null;
        }

        current = current[key];
    }
    return current;
};