/* eslint-disable no-param-reassign */

// BEGIN (write your solution here)
const validateProperty = (name, property) => {
    if (property === undefined) {
        throw new Error(`Property "${name}" not exists`);
    }
    if (name.startsWith('_')) {
        throw new Error(`Property "${name}" is protected`);
    }
};

const protect = (obj) => new Proxy(obj, {
    get: (target, name) => {
        const property = target[name];
        validateProperty(name, property);

        return (typeof property === 'function') ? property.bind(obj) : property;
    },
    set: (target, name, value) => {
        const property = target[name];
        validateProperty(name, property);
        target[name] = value;

        return true;
    },
});

export default protect;
// END