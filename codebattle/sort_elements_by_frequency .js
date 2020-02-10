// Given an array of integers, sort the array according to frequency of elements. Most frequent numbers come first. If several groups of the same size exist, they should appear in the order of corresponding numbers in the input array.

// Example:
// [3,3,3,3,2,2,2,12,12,4,5]  == solution([2,3,2,4,5,12,2,3,3,3,12])
// [2,2,2,3,4]  == solution([2,2,2,3,4])
// [1,1,1,1,2,2,3,3,4]  == solution([1,2,1,2,1,4,3,3,1])
// [8,8,7,7,2,2,1,1,9,9,6]  == solution([8,6,8,7,2,2,7,1,9,9,1])
// [4,4,9,-11,1,12,-10,3,-3,6,5,2,-9]  == solution([9,-11,1,12,-10,3,-3,6,5,2,-9,4,4])

function solution(arr) {
    const map = {};

    for (let i = 0; i < arr.length; i++) {
        if (map.hasOwnProperty(arr[i])) {
            map[arr[i]].count += 1;
        } else {
            map[arr[i]] = {
                value: arr[i],
                count: 1,
                index: i
            };
        }
    }

    const sortedMap = Object.values(map).sort((obj1, obj2) => {
        const {
            count: count1,
            index: index1
        } = obj1;
        const {
            count: count2,
            index: index2
        } = obj2;

        if (count1 > count2) return -1;
        else if (count1 < count2) return 1;

        if (index1 > index2) return 1;
        if (index1 < index2) return -1;

        return 0;
    });

    return sortedMap.reduce((acc, map) => {
        const {
            value,
            count
        } = map;
        const nums = new Array(count).fill(value);
        return [...acc, ...nums];
    }, []);
}