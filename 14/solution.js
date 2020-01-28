export default (coll) => {
    if (coll.length === 0) return "";

    const result = [];

    for (const definition of coll) {
        const [title, body] = definition;
        result.push(`<dt>${title}</dt><dd>${body}</dd>`);
    }

    return `<dl>${result.join("")}</dl>`;
}