// @ts-check
import math from "./math";

export default class FastHashGrid {
    constructor(bounds, dimensions) {
        this._bounds = bounds;
        this._dimensions = dimensions;
        this._cells = [...Array(dimensions[0])].map(_ => [...Array(dimensions[1])].map(_ => (null)));
        this._queryIds = 0;
    }

    newClient(position, dimensions) {
        const client = {
            position,
            dimensions,
            _cells: {
                min: null,
                max: null,
                nodes: null,
            },
            _queryId: -1,
        };
        
        this._insert(client);

        return client;
    }

    findNear(position, bounds) {
        const clients = [];
        const queryId = this._queryIds + 1;

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
                let head = this._cells[x][y];

                while (head) {
                    const v = head.client;
                    head = head.next;

                    if (v._queryId !== queryId) {
                        v._queryId = queryId;
                        clients.push(v);
                    }
                }
            }
        }

        return clients;
    }

    updateClient(client) {
        if (this._canUpdateClient(client)) {
            this.removeClient(client);
            this._insert(client);
        }
    }

    removeClient(client) {
        const minIndex = client._cells.min;
        const maxIndex = client._cells.max;

        const minX = minIndex[0];
        const maxX = maxIndex[0];

        const minY = minIndex[1];
        const maxY = maxIndex[1];

        for (let x = minX; x <= maxX; x += 1) {
            for (let y = minY; y <= maxY; y += 1) {
                const xIndex = x - minX;
                const yIndex = y - minY; 
                const node = client._cells.nodes[xIndex][yIndex];

                if (node.next) {
                    node.next.prev = node.prev;
                }

                if (node.prev) {
                    node.prev.next = node.next;
                }

               if (!node.prev) {
                   this._cells[x][y] = node.next;
               }
            }
        }

        client._cells.min = null;
        client._cells.max = null;
        client._cells.nodes = null;
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

        const nodes = [];

        for (let x = minX; x <= maxX; x += 1) {
            nodes.push([]);

            for (let y = minY; y <= maxY; y += 1) {
                const xIndex = x - minX;

                const head = {
                    next: null,
                    prev: null,
                    client,
                };

                nodes[xIndex].push(head);

                head.next = this._cells[x][y];

                if (this._cells[x][y]) {
                    this._cells[x][y].prev = head;
                }

                this._cells[x][y] = head;
            }
        }

        client._cells.min = minIndex;
        client._cells.max = maxIndex;
        client._cells.nodes = nodes;
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

    _canUpdateClient(client) {
        const [posX, posY] = client.position;
        const [w, h] = client.dimensions;

        const minIndex = this._getCellIndex([posX - w / 2, posY - h / 2]);
        const maxIndex = this._getCellIndex([posX + w / 2, posY + h / 2]);

        const minX = minIndex[0];
        const maxX = maxIndex[0];

        const minY = minIndex[1];
        const maxY = maxIndex[1];

        const clientMinX = client._cells.min[0];
        const clientMaxX = client._cells.max[0];

        const clientMinY = client._cells.min[1];
        const clientMaxY = client._cells.max[1];

        if (clientMinX === minX &&
            clientMinY === minY &&
            clientMaxX === maxX &&
            clientMaxY === maxY) {
            return false;
        }

        return true;
    }
}