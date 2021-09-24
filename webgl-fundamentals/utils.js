/**
 * @param {Number} range
 * @returns {Number}
 */
export function randomInt(range) {
    return Math.floor(Math.random() * range);
}

/**
 * @param {Number} range
 * @returns {Number}
 */
export function radToDeg(r) {
    return r * 180 / Math.PI;
}

/**
 * @param {Number} range
 * @returns {Number}
 */
export function degToRad(d) {
    return d * Math.PI / 180;
}