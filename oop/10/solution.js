// @ts-check

export default class Cart {
    constructor() {
        this.items = [];
    }

    addItem(good, count) {
        this.items.push({
            good,
            count
        });
    }

    getItems() {
        return this.items.slice();
    }

    getCost() {
        return this.getItems()
            .reduce((acc, item) => {
                const {
                    good,
                    count
                } = item;
                const {
                    price
                } = good;
                return acc + price * count;
            }, 0)
    }

    getCount() {
        return this.getItems()
            .reduce((acc, item) => {
                const {
                    count
                } = item;
                return acc + count;
            }, 0)
    }
}