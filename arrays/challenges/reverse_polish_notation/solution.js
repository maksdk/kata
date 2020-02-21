const operations = {
    "*": (n1, n2) => n1 * n2,
    "/": (n1, n2) => n1 / n2,
    "+": (n1, n2) => n1 + n2,
    "-": (n1, n2) => n1 - n2
};

export default arr => {
    const result = arr.reduce((acc, value) => {
        const operation = operations[value];
        if (operation) {
            const [num1, num2] = acc.splice(acc.length - 2);
            const result = operation(num1, num2);
            return [...acc, result];
        }

        return [...acc, value];
    }, []);

    return result[0];
};