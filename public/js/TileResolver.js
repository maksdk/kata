// @ts-check
export default class TileResolver {
    constructor(matrix, tileSize = 16) {
        this.matrix = matrix;
        this.tileSize = tileSize;
    }

    toIndex(pos) {
        return Math.floor(pos / this.tileSize);
    }

    toIndexRange(pos1, pos2) {
        const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize;
        const range = [];

        let pos = pos1;
        do {
            range.push(this.toIndex(pos));
            pos += this.tileSize;
        } while (pos < pMax) 

        return range;
    }

    getByIndex(indexX, indexY) {
        const tile = this.matrix.get(indexX, indexY);
        if (tile) {
            const y1 = indexY * this.tileSize;
            const y2 = y1 + this.tileSize;

            const x1 = indexX * this.tileSize;
            const x2 = x1 + this.tileSize;
            return {
                tile,
                y1,
                y2,
                x2,
                x1
            };
        }
        return null;
    }

    searchByPosition(posX, posY) {
        return this.getByIndex(this.toIndex(posX), this.toIndex(posY));
    }

    searchByRange(x1, x2, y1, y2) {
        const matches = [];
        const xRange = this.toIndexRange(x1, x2);
        const yRange = this.toIndexRange(y1, y2);

        xRange.forEach((indexX) => {
            yRange.forEach((indexY) => {
                const match = this.getByIndex(indexX, indexY);
                if (match) {
                    matches.push(match);
                }
            });
        });

        return matches;
    }
}