export class Vector {
    public constructor(public x: number = 0, public y: number = 0) {

    }

    public normalize(): Vector {
        const l = this.length();
        return new Vector(this.x / l, this.y / l);
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public sub(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }
}