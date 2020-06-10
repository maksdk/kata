// @ts-check
export default class Trait {
    constructor(name) {
        this.NAME = name;
    }

    obstruct() {
        
    }

    update(entity, deltaTime) {
        console.warn('Unhandled update call in Trait');
    }
}