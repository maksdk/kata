export default str => {
    const uniqColl = [];
    for (const letter of str) {
        if (uniqColl.includes(letter)) continue;
        uniqColl.push(letter);
    }
    return uniqColl.length;
}