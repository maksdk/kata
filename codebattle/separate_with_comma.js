// Given a number as input, return a string with that number formatted with commas to separate each three digits from the right to make it look like a standard North American number.

// Example:

// "1,238,592"  == solution(1238592)
// "1"  == solution(1)
// "10"  == solution(10)
// "150"  == solution(150)
// "1,234"  == solution(1234)
// "15,075"  == solution(15075)
// "123,456"  == solution(123456)

function solution(num) {
    const str = String(num);
    const acc = str.split("");
    const size = acc.length;
    for (let i = size - 3; i > 0; i -= 3) {
        acc.splice(i, 0, ",");
    }
    return acc.join("");
}