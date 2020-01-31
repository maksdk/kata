const sort = coll => {
    let swaped = true;
    let size = coll.length;

    while (swaped) {
        swaped = false;

        for (let i = 0; i < size; i++) {
            if (coll[i] > coll[i + 1]) {
                const temp = coll[i];
                coll[i] = coll[i + 1];
                coll[i + 1] = temp;
                swaped = true;
            }
        }

        size += 1;
    }
    return coll;
};