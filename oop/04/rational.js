//@ts-check

// Формула сложения: a/b + c/d = a * d + b * c / b * d
const make = (numer, denom) => ({
    numer,
    denom,
    getNumer() {
        return this.numer;
    },
    getDenom() {
        return this.denom;
    },
    add(rat) {
        const a = this.getNumer();
        const b = this.getDenom();
        const c = rat.getNumer();
        const d = rat.getDenom();

        const numer = a * d + b * c;
        const denom = b * d;

        return make(numer, denom);
    },
    toString() {
        return `${this.getNumer()}/${this.getDenom()}`;
    }
});

export default make;