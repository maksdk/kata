export default expresion => {
    const lastWord = [];
    let state = "out";

    for (let i = expresion.length - 1; i >= 0; i--) {
        switch (state) {
            case "out":
                if (expresion[i] !== " ") {
                    lastWord.push(expresion[i]);
                    state = "in";
                }
                break;
            case "in":
                if (expresion[i] === " ") {
                    return lastWord.length;
                } else {
                    lastWord.push(expresion[i]);
                }
                break;
            default:
                throw "Such state is not found";

        }

    }

    return lastWord.length;
};