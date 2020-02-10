// Given an array of integers, find the largest pair sum in it. For example, the largest pair sum in 12, 34, 10, 6, 40 is 74.
// Example:
// 11  == solution([1,2,3,4,5,6])
// 74  == solution([12,34,10,6,40])
// 80  == solution([12,40,10,6,40])
// 52  == solution([12,-34,10,6,40])

function solution(arr) {
    if (arr.length === 0) return 0;
    if (arr.length === 1) return arr[0];

    arr.sort((a, b) => {
        if (a > b) return -1;
        else if (a < b) return 1;
        return 0;
    });

    return arr[0] + arr[1];
}