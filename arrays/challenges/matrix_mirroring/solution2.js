const getMirrorArray = (array) => {
    const size = array.length;
    const mirrored = [];

    for (let i = 0; i < size / 2; i += 1) {
        mirrored[i] = array[i];
        mirrored[size - i - 1] = array[i];
    }

    return mirrored;
};

const getMirrorMatrix = (matrix) => {
    const mirroredMatrix = [];

    for (const row of matrix) {
        const mirroredRow = getMirrorArray(row);
        mirroredMatrix.push(mirroredRow);
    }

    return mirroredMatrix;
};

export default getMirrorMatrix;