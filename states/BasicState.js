//@ts-check

export default class BasicState {
    constructor(mainClass) {
        this.mainClass = mainClass;

        this.nextState = null;
        this.mode = null;
        this.typeTime = null;
    }

    setNextState(state) {
        this.mainClass.setState(state || this.nextState);
    }

    getMode() {
        return this.mode;
    }

    clickH() {
        this.typeTime && this.mainClass.incrementH(this.typeTime);
    }

    clickM() {
        this.typeTime && this.mainClass.incrementM(this.typeTime);
    }

    tick() {

    }
}