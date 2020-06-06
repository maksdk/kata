// @ts-check
export class Matrix {
    constructor() {
        this.grid = [];
    }

    set(x, y, value) {
        if (!this.grid[x]) {
            this.grid[x] = [];
        }

        this.grid[x][y] = value;
    }

    get(x, y) {
        const column = this.grid[x];
        if (column) {
            return column[y];
        }
        return null;
    }

    forEach(fn) {
        this.grid.forEach((column, x) => {
            column.forEach((value, y) => {
                fn(value, x, y);
            });
        });
    }
}

export class Vec2 {
    constructor(x, y) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }
}