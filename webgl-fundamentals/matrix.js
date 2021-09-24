// @ts-check

/**
 * @typedef {Object[]} Matrix4
 */
export const m3 = {
    identify() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    },
    projection(w, h) {
        return [
            2 / w, 0, 0,
            0, -2 / h, 0,
            -1, 1, 1
        ];
    },
    translation(tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1
        ];
    },
    rotation(rad) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1
        ];
    },
    scaling(sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1
        ];
    },
    multiply: function (a, b) {
        const a00 = a[0 * 3 + 0];
        const a01 = a[0 * 3 + 1];
        const a02 = a[0 * 3 + 2];
        const a10 = a[1 * 3 + 0];
        const a11 = a[1 * 3 + 1];
        const a12 = a[1 * 3 + 2];
        const a20 = a[2 * 3 + 0];
        const a21 = a[2 * 3 + 1];
        const a22 = a[2 * 3 + 2];
        const b00 = b[0 * 3 + 0];
        const b01 = b[0 * 3 + 1];
        const b02 = b[0 * 3 + 2];
        const b10 = b[1 * 3 + 0];
        const b11 = b[1 * 3 + 1];
        const b12 = b[1 * 3 + 2];
        const b20 = b[2 * 3 + 0];
        const b21 = b[2 * 3 + 1];
        const b22 = b[2 * 3 + 2];
        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
};

export const m4 = {
    /**
     * @returns {Matrix4}
     */
    identify() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },
    /**
     * @param {Number} tx 
     * @param {Number} ty 
     * @param {Number} tz 
     * @returns {Matrix4}
     */
    translation(tx, ty, tz) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ];
    },

    /**
     * @param {Number} rad 
     * @returns {Matrix4}
     */
    xRotation(rad) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ];
    },

    /**
     * @param {Number} rad 
     * @returns {Matrix4}
     */
    yRotation(rad) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ];
    },

    /**
     * @param {Number} rad 
     * @returns {Matrix4}
     */
    zRotation(rad) {
        const s = Math.sin(rad);
        const c = Math.cos(rad);
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    /**
     * @param {Number} sx 
     * @param {Number} sy 
     * @param {Number} sz 
     * @returns {Matrix4}
     */
    scaling(sx, sy, sz) {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ];
    },

    /**
     * @param {Matrix4} a 
     * @param {Matrix4} b 
     * @returns {Matrix4}
     */
    multiply(a, b) {
        const a00 = a[0 * 4 + 0];
        const a01 = a[0 * 4 + 1];
        const a02 = a[0 * 4 + 2];
        const a03 = a[0 * 4 + 3];
        const a10 = a[1 * 4 + 0];
        const a11 = a[1 * 4 + 1];
        const a12 = a[1 * 4 + 2];
        const a13 = a[1 * 4 + 3];
        const a20 = a[2 * 4 + 0];
        const a21 = a[2 * 4 + 1];
        const a22 = a[2 * 4 + 2];
        const a23 = a[2 * 4 + 3];
        const a30 = a[3 * 4 + 0];
        const a31 = a[3 * 4 + 1];
        const a32 = a[3 * 4 + 2];
        const a33 = a[3 * 4 + 3];
        const b00 = b[0 * 4 + 0];
        const b01 = b[0 * 4 + 1];
        const b02 = b[0 * 4 + 2];
        const b03 = b[0 * 4 + 3];
        const b10 = b[1 * 4 + 0];
        const b11 = b[1 * 4 + 1];
        const b12 = b[1 * 4 + 2];
        const b13 = b[1 * 4 + 3];
        const b20 = b[2 * 4 + 0];
        const b21 = b[2 * 4 + 1];
        const b22 = b[2 * 4 + 2];
        const b23 = b[2 * 4 + 3];
        const b30 = b[3 * 4 + 0];
        const b31 = b[3 * 4 + 1];
        const b32 = b[3 * 4 + 2];
        const b33 = b[3 * 4 + 3];
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },

    /**
     * @param {Matrix4} m 
     * @param {Number} tx 
     * @param {Number} ty 
     * @param {Number} tz 
     * @returns {Matrix4}
     */
    translate(m, tx, ty, tz) {
        return m4.multiply(m, m4.translation(tx, ty, tz));
    },

    /**
     * @param {Matrix4} m 
     * @param {Number} rad 
     * @returns {Matrix4}
     */
    xRotate(m, rad) {
        return m4.multiply(m, m4.xRotation(rad));
    },

    /**
     * @param {Matrix4} m 
     * @param {Number} rad 
     * @returns {Matrix4}
     */
    yRotate(m, rad) {
        return m4.multiply(m, m4.yRotation(rad));
    },

    /**
     * @param {Matrix4} m 
     * @param {Number} rad 
     * @returns {Matrix4}
     */
    zRotate(m, rad) {
        return m4.multiply(m, m4.zRotation(rad));
    },

    /**
     * @param {Matrix4} m 
     * @param {Number} sx 
     * @param {Number} sy
     * @param {Number} sz 
     * @returns {Matrix4}
     */
    scale(m, sx, sy, sz) {
        return m4.multiply(m, m4.scaling(sx, sy, sz));
    },

    /**
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} depth 
     * @returns {Matrix4}
     * @description Convert pixels to clip space
     */
    projection(width, height, depth) {
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1
        ];
    },

    /**
     * @param {Number} left 
     * @param {Number} right 
     * @param {Number} top 
     * @param {Number} bottom 
     * @param {Number} near 
     * @param {Number} far 
     * @returns {Matrix4}
     */
    orthographic(left, right, bottom, top, near, far) {
        return [
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, 2 / (near - far), 0,
            (left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1
        ];
    }
};