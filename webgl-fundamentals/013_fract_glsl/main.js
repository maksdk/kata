// @ts-check

// TODO: https://webglfundamentals.org/webgl/lessons/ru/webgl-3d-perspective-correct-texturemapping.html

import { createGL, createProgram, createShader, resize } from '../webgl-utils.js';

const VertShader = `
    attribute vec4 aPosition;
    attribute float aBrightness;

    varying float vBrightness;

    void main() {
        gl_Position = aPosition;
        vBrightness = aBrightness;
    }
`;

const FragShader = `
    precision mediump float;
    varying float vBrightness;

    void main() {
        gl_FragColor = vec4(fract(vBrightness * 10.0), 0.0, 0.0, 1.0);
    }
`;

function main() {
    const gl = createGL();
    const vertShader = createShader(gl, gl.VERTEX_SHADER, VertShader);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FragShader);
    const program = createProgram(gl, vertShader, fragShader);

    const positionAttribLoc = gl.getAttribLocation(program, 'aPosition');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -.8, .8, 0, 1,  // 1st rect 1st triangle
        .8, .8, 0, 1,
        -.8, .2, 0, 1,

        -.8, .2, 0, 1,  // 1st rect 2nd triangle
        .8, .8, 0, 1,
        .8, .2, 0, 1,
    ]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const colorAttribLoc = gl.getAttribLocation(program, 'aBrightness');
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0,  // 1st rect 1st triangle
        1,
        0,
        0,  // 1st rect 2nd triangle
        1,
        1,
    ]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    resize(gl);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    // positions
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttribLoc);
    gl.vertexAttribPointer(positionAttribLoc, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // colors
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(colorAttribLoc);
    gl.vertexAttribPointer(colorAttribLoc, 1, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

main();