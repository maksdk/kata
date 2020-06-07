import { Vec2 } from './math.js';

export default class Camera {
    constructor() {
        this.pos = new Vec2();
        this.size = new Vec2(256, 244);
    }
}