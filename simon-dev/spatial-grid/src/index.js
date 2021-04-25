// @ts-check
import math from "./math";
import SpatialGrid from "./MiddleGrid";
import SlowGrid from "./SlowGrid";
import FastHashGrid from "./FastGrid";

const iterations = 1000;
const clientsCount = 100000;
const clientBounds = [
    [-1000, -1000],
    [1000, 1000]
];
const clientDimensions = [100, 100];

const clientPositions = [];
for (let i = 0; i < clientsCount; i += 1) {
    const bx1 = clientBounds[0][0];
    const bx2 = clientBounds[1][0];
    const by1 = clientBounds[0][1];
    const by2 = clientBounds[1][1];
    clientPositions.push([math.randRange(bx1, bx2), math.randRange(by1, by2)]);
}
// console.log("Client positions: ", clientPositions);
const clientQueries = [];
for (let i = 0; i < iterations; i += 1) {
    const bx1 = clientBounds[0][0];
    const bx2 = clientBounds[1][0];
    const by1 = clientBounds[0][1];
    const by2 = clientBounds[1][1];
    clientQueries.push([math.randRange(bx1, bx2), math.randRange(by1, by2)]);
}

const clientMoves = [];
for (let i = 0; i < clientsCount; ++i) {
    const p = [Math.random(), Math.random()];
    clientMoves.push(p);
}

class GridTester {
    constructor(GridClass) {
        this._grid = new GridClass(clientBounds, clientDimensions);

        this._clients = [];

        for (let i = 0; i < clientsCount; ++i) {
            const client = this._grid.newClient(clientPositions[i], [15, 15]);
            this._clients.push(client);
        }
    }

    testFindNearby() {
        const queryBounds = [15, 15];

        let startTime = performance.now();
        for (let i = 0; i < iterations; ++i) {
            this._grid.findNear(clientQueries[i], queryBounds);
        }
        let totalTime = performance.now() - startTime;
        return totalTime;
    }

    testUpdate() {
        for (let i = 0; i < this._clients.length; ++i) {
            const c = this._clients[i];
            c.position[0] = clientPositions[i][0];
            c.position[1] = clientPositions[i][1];
            this._grid.updateClient(this._clients[i]);
        }

        let startTime = performance.now();
        for (let i = 0; i < this._clients.length; ++i) {
            const c = this._clients[i];
            c.position[0] += clientMoves[i][0];
            c.position[1] += clientMoves[i][1];
            this._grid.updateClient(this._clients[i]);
        }
        let totalTime = performance.now() - startTime;

        return totalTime;
    }
}

const gridSlow = new GridTester(SlowGrid);
const gridSpatial = new GridTester(SpatialGrid);
const gridFast = new GridTester(FastHashGrid);

console.log(
    "Slow Grid (Naive) - FindNearby: " + gridSlow.testFindNearby() + "ms"
);
console.log(
    "Spatial Grid - FindNearby: " + gridSpatial.testFindNearby() + "ms"
);
console.log("Fast Grid - FindNearby: " + gridFast.testFindNearby() + "ms");

console.log("----------------------------------");
console.log(
    "Slow Grid (Naive) - FindNearby: " + gridSlow.testFindNearby() + "ms"
);
console.log(
    "Spatial Grid - FindNearby: " + gridSpatial.testFindNearby() + "ms"
);
console.log("Fast Grid - FindNearby: " + gridFast.testFindNearby() + "ms");

console.log("----------------------------------");
console.log("----------------------------------");

console.log("Slow Grid (Naive) - Update: " + gridSlow.testUpdate() + "ms");
console.log("Spatial Grid - Update: " + gridSpatial.testUpdate() + "ms");
console.log("Fast Grid - Update: " + gridFast.testUpdate() + "ms");

console.log("----------------------------------");
console.log("Slow Grid (Naive) - Update: " + gridSlow.testUpdate() + "ms");
console.log("Spatial Grid - Update: " + gridSpatial.testUpdate() + "ms");
console.log("Fast Grid - Update: " + gridFast.testUpdate() + "ms");