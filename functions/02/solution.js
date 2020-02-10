function isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;

    let counter = 2;
    while (counter < num) {
        if (num % counter === 0) return false;
        counter += 1;
    }

    return true;
}

export default num => {
    if (isPrime(num)) {
        console.log('yes');
    } else {
        console.log('no');
    }
}