export default (v1, v2) => {
    const [major1 = 0, minor1 = 0] = v1.split(".").map(v => Number(v));
    const [major2 = 0, minor2 = 0] = v2.split(".").map(v => Number(v));

    if (major1 > major2) return 1;
    if (major1 < major2) return -1;

    if (minor1 > minor2) return 1;
    if (minor1 < minor2) return -1;

    return 0;
};