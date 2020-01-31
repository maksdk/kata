const flat = (coll, depth = 1) => {
    const iter = (coll, count) => {
        if (count >= depth) return coll;

        return coll.reduce((acc, el) => {
            if (Array.isArray(el)) return [...acc, ...iter(el, count + 1)];
            return [...acc, el];
        }, []);
    };

    return iter(coll, 0);
}