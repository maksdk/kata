const calcInPolishNotation = (array) => {
    const stack = [];
    const operators = ['*', '/', '+', '-'];

    for (const value of array) {
        if (!operators.includes(value)) {
            stack.push(value);
            continue;
        }

        const b = stack.pop();
        const a = stack.pop();
        let result;

        switch (value) {
            case '*':
                result = a * b;
                break;
            case '/':
                result = a / b;
                break;
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            default:
                break;
        }

        stack.push(result);
    }

    return stack.pop();
};

export default calcInPolishNotation;