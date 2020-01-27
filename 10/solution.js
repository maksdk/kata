export default coll => {
    if (coll.length === 0) return null;
    let sum = 0;
    for (const value of coll) {
        sum += value;
    }
    return sum / coll.length;
}