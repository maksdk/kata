export default (arr) => {
    if (arr.length <= 1) return false;
    let prevNum = arr[0];

    for (let i = 1; i < arr.length; i += 1) {
        if (Math.abs(Math.abs(prevNum) - Math.abs(arr[i])) !== 1) return false;
        prevNum = arr[i];
    }

    return true;
};