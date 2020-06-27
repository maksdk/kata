// 1
const coll = [1, 2, 3, 4, 5];
for (let currIndex = 0; currIndex < 30; currIndex += 1) {
    const nextIndex = ((currIndex + 1) % coll.length); 
    console.log(nextIndex)   
}

// 2
class Collection {
    constructor(items = []) {
        this.items = items;
        this.currIndex = 0;
    }

    next() {
        const nextIndex =  ((currIndex + 1) % coll.length);
        return this.items[nextIndex];
    }
}