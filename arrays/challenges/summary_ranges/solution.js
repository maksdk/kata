//@ts-check
export default numbers => {
    if (numbers.length <= 1) return [];

    const ranges = numbers.reduce((acc, num) => {
        if (acc.length === 0) {
            return [[num]];
        }

        const range = acc[acc.length - 1];
        const rangeLastNum = range[range.length - 1];
        if (rangeLastNum + 1 === num) {
            range.push(num);
            acc[acc.length - 1] = range;
            return acc;
        }

        return [...acc, [num]];
    }, []);

    return ranges
        .filter(range => range.length > 1)
        .map(range => `${range[0]}->${range[range.length - 1]}`);
};