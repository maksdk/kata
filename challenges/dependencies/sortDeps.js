//@ts-check
const sortDeps = (obj) => {

    const iter = (depName, acc) => {
        if (acc.find(n => n === depName)) return acc;
        if (!obj[depName]) return [...acc, depName];

        return [...obj[depName].reduce((initAcc, key) => iter(key, initAcc), acc), depName];
    };

    return Object.keys(obj)
        .reduce((acc, key) => iter(key, acc), [])
};



// export default sortDeps;