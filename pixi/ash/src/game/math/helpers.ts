export function randomRange(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number): number {
	return Math.floor(min + Math.random() * (max - min + 1));
}

export function randomPI(): number {
	return Math.acos((Math.random() * 2) - 1);
}

export function randomDoublePI(): number {
	return Math.random() * 2 * Math.PI;
}

export function randomHexColor(): string {
    return'#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

export function radToDeg(rad: number): number {
	return 180 / Math.PI * rad;
}

export function degToRad(deg: number): number {
	return Math.PI / 180 * deg;
}

export function roundToPlaces(value: number, places: number): number {
    const mult = Math.pow(10, places);
    return Math.round(value * mult) / mult;
}
 
export function roundNearest(value: number, nearest: number): number {
    return Math.round(value / nearest) * nearest;
}
 
export function norm(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
}

export function lerp(norm: number, min: number, max: number): number {
    return (max - min) * norm + min; 
}

export function map(value: number, sourceMin: number, sourceMax: number, destMin: number, destMax: number): number {
    const n = norm(value, sourceMin, sourceMax);
    return lerp(n, destMin, destMax);
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}