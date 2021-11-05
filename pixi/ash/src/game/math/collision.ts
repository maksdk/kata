import { Vector } from '@core/game/math/Vector';

export function pointInPolygon(point: Vector, polygon: Vector[]): boolean {
    // from https://github.com/substack/point-in-polygon 

    const x = point.x;
    const y = point.y;

    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x;
        const yi = polygon[i].y;
        const xj = polygon[j].x;
        const yj = polygon[j].y;

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) {
            inside = !inside;
        }
    }

    return inside;
}

export function pointInRect(point: Vector, r: { x: number; y: number; width: number; height: number, originX: number; originY: number }): boolean {
    const pos = new Vector(r.x, r.y).sub(new Vector(r.width * r.originX, r.height * r.originY));
    return inRange(point.x, pos.x, pos.x + r.width) && inRange(point.y, pos.y, pos.y + r.height);
}

function inRange(val: number, min: number, max: number): boolean {
	return val >= Math.min(max, min) && val <= Math.max(max, min);
}

export function circleInRect(circle: { x: number; y: number; r: number; }, rect: {x: number; y: number; w: number; h: number } ): boolean {
    const dx = Math.abs(circle.x - rect.x);
    const dy = Math.abs(circle.y - rect.y);

    if (dx > (rect.w / 2 + circle.r)) { 
        return false; 
    }

    if (dy > (rect.h / 2 + circle.r)) { 
        return false; 
    }

    if (dx <= (rect.w / 2)) { 
        return true; 
    } 

    if (dy <= (rect.h / 2)) {
        return true; 
    }

    const conerDist = (dx - rect.w / 2) ** 2 + (dy - rect.h / 2) ** 2;

    return conerDist <= circle.r ** 2;
}