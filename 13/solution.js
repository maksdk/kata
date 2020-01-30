export default coll => {
    let canada = 0;
    let ussr = 0;

    for (let i = 0; i < coll.length; i++) {
        const [c, u] = coll[i];
        if (c > u) canada += 1;
        else if (u > c) ussr += 1;
    }

    if (canada === ussr) return null;

    return canada > ussr ? "canada" : "ussr";
}