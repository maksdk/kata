export default function magic(...arg) {
    const sum = arg.reduce((acc, val) => acc + val, 0);

    function cb(...arg) {
        return magic(sum, ...arg);
    }

    cb.toString = function () {
        return sum;
    }

    return cb;
}