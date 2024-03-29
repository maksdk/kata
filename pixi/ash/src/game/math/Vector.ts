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

    public add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    public clone(): Vector {
        return new Vector(this.x, this.y);
    }

    public mulScalar(scalar: number): Vector {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    public setAngle(rad: number): Vector {
		const x = Math.cos(rad) * this.length();
		const y = Math.sin(rad) * this.length();
        return new Vector(x, y);
	}

    public getAngle(): number {
		return Math.atan2(this.y, this.x);
	}

    public static distance(v1: Vector, v2: Vector): number {
        const dx = v1.x - v2.x;
        const dy = v1.y - v2.y;
        return Math.sqrt(dx * dx + dy * dy);
    } 

    public static sub2(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
}