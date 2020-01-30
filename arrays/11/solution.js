export default (coll, currency) => {
    let sum = 0;
    for (const value of coll) {
        if (value.slice(0, 3) === currency) {
            const valueCurrency = Number(value.slice(4, value.length));
            sum += valueCurrency;
        }
    }
    return sum;
};