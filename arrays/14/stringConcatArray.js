const stringConcatArr = (list) => {
    const result = [];

    for(const body of list) {
        result.push(`<li>${body}</li>`);
    }

    return `<ul>${result.join("")}</ul>`;
};