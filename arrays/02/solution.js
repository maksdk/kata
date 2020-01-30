const mapOperations = {
    "reset": () => [],
    "get": (arr, index) => arr[index],
    "change": (arr, index, value) => {
        return arr.reduce((acc, v, i) => i === index ? [...acc, value] : [...acc, v], []);
    },
    "default": (arr) => arr
};

const apply = (arr, operationName, index, value) => {
    const operate = mapOperations[operationName] || mapOperations["default"];
    return operate(arr, index, value);
};

export default apply;