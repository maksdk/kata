// @ts-check
import math from "./math";

export default class SpatialHashGrid {
    constructor(bounds, dimensions) {
        this._bounds = bounds;
        this._dimensions = dimensions;
        this._cells = new Map();
    }

    newClient(position, dimensions) {
        const client = {
            position,
            dimensions,
            indices: null
        };
        
        this._insert(client);

        return client;
    }

    findNear(position, bounds) {
        const clients = new Set();

        const [posX, posY] = position;
        const [w, h] = bounds;

        const minIndex = this._getCellIndex([posX - w / 2, posY - h / 2]);
        const maxIndex = this._getCellIndex([posX + w / 2, posY + h / 2]);

        const minX = minIndex[0];
        const maxX = maxIndex[0];

        const minY = minIndex[1];
        const maxY = maxIndex[1];

        for (let x = minX; x <= maxX; x += 1) {
            for (let y = minY; y <= maxY; y += 1) {
                const key = this._key(x, y);
                if (this._cells.has(key)) {
                    const cell = this._cells.get(key);
                    for (let v of cell) {
                        clients.add(v);
                    }
                }
            }
        }

        return clients;
    }

    updateClient(client) {
        this.removeClient(client);
        this._insert(client);
    }

    removeClient(client) {
        const [minIndex, maxIndex] = client.indices;

        const minX = minIndex[0];
        const maxX = maxIndex[0];

        const minY = minIndex[1];
        const maxY = maxIndex[1];

        for (let x = minX; x <= maxX; x += 1) {
            for (let y = minY; y <= maxY; y += 1) {
                const key = this._key(x, y);
                const cell = this._cells.get(key);
                cell.delete(client);
            }
        }
    }

    _insert(client) {
        const [posX, posY] = client.position;
        const [w, h] = client.dimensions;

        const minIndex = this._getCellIndex([posX - w / 2, posY - h / 2]);
        const maxIndex = this._getCellIndex([posX + w / 2, posY + h / 2]);

        const minX = minIndex[0];
        const maxX = maxIndex[0];

        const minY = minIndex[1];
        const maxY = maxIndex[1];

        client.indices = [minIndex, maxIndex];

        for (let x = minX; x <= maxX; x += 1) {
            for (let y = minY; y <= maxY; y += 1) {
                const key = this._key(x, y);

                if (!this._cells.has(key)) {
                    this._cells.set(key, new Set());
                }

                const cell = this._cells.get(key);
                cell.add(client);
            }
        }
    }

    _key(x, y) {
        return `${x}.${y}`;
    }

    _getCellIndex(position) {
        const [w, h] = this._dimensions;
        const [posX, posY] = position;

        const minX = this._bounds[0][0];
        const minY = this._bounds[0][1];

        const maxX = this._bounds[1][0];
        const maxY = this._bounds[1][1];

        const x = math.sat((posX - minX) / (maxX - minX));
        const y = math.sat((posY - minY) / (maxY - minY));

        const xIndex = Math.floor(x * (w - 1));
        const yIndex = Math.floor(y * (h - 1));

        return [xIndex, yIndex];
    }
}