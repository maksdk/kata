// @ts-check

import { createGL, createProgram, createShader, resize } from '../webgl-utils.js';
import { m4 } from '../math.js';
import { degToRad } from '../utils.js';

/**
 * @typedef {Object} IState
 * @property {WebGLRenderingContext} gl
 * @property {WebGLProgram} program
 * @property {WebGLBuffer} positionBuffer
 * @property {number} positionAttribLoc
 * @property {WebGLUniformLocation} matrixUniformLoc
 */

const VertShader = `
    attribute vec4 aPosition;
    attribute vec2 aTexCoord;
    
    uniform mat4 uMvpMatrix;

    void main() {
        gl_Position = uMvpMatrix * aPosition;
    }
`;

const FragShader = `
    precision mediump float;

    uniform sampler2D uImage;

    varying vec2 vTexCoord;

    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;


let xMatrixRot = 0;
let yMatrixRot = 0;

/**
 * @param {IState} state 
 */
function drawScene(state) {
    const {
        gl,
        program,
        positionBuffer,
        positionAttribLoc,
        matrixUniformLoc
    } = state;

    resize(gl);

    // gl.enable(gl.CULL_FACE);
    // gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttribLoc);
    gl.vertexAttribPointer(positionAttribLoc, 3, gl.FLOAT, false, 0, 0);

    // 1. projection matrix (ortho or perspective)
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const fov = degToRad(60);
    const near = 1;
    const far = 2000;
    const projectMatrix = m4.perspective(fov, aspect, near, far);

    // 2. view matrix
    const cameraPos = [0, 0, 200];
    const up = [0, 1, 0];
    const target = [0, 0, 0];
    const viewMatrix = m4.inverse(m4.lookAt(cameraPos, target, up));

    // 3. model matrix (rotate, translate, scaling)
    let modelMatrix = m4.identify();
    modelMatrix = m4.xRotate(modelMatrix, xMatrixRot);
    modelMatrix = m4.yRotate(modelMatrix, yMatrixRot);

    // 4. mvp matrix (model view projection)
    const mvpMatrix = m4.multiply(m4.multiply(projectMatrix, viewMatrix), modelMatrix);

    gl.uniformMatrix4fv(matrixUniformLoc, false, mvpMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);

    xMatrixRot += 0.01;
    yMatrixRot += 0.01;

    requestAnimationFrame(() => drawScene(state));
}


function main() {
    const gl = createGL();
    const vertShader = createShader(gl, gl.VERTEX_SHADER, VertShader);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FragShader);
    const program = createProgram(gl, vertShader, fragShader);

    const positionAttribLoc = gl.getAttribLocation(program, 'aPosition');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const matrixUniformLoc = gl.getUniformLocation(program, 'uMvpMatrix');

    drawScene({
        gl,
        program,
        positionBuffer,
        positionAttribLoc,
        matrixUniformLoc
    });
}

/**
 * @param {WebGLRenderingContext} gl
 */
// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
    const positions = new Float32Array([
        // left column front
        0, 0, 0,
        30, 0, 0,
        0, 150, 0,
        0, 150, 0,
        30, 0, 0,
        30, 150, 0,

        // top rung front
        30, 0, 0,
        100, 0, 0,
        30, 30, 0,
        30, 30, 0,
        100, 0, 0,
        100, 30, 0,

        // middle rung front
        30, 60, 0,
        67, 60, 0,
        30, 90, 0,
        30, 90, 0,
        67, 60, 0,
        67, 90, 0,

        // left column back
        0, 0, 30,
        30, 0, 30,
        0, 150, 30,
        0, 150, 30,
        30, 0, 30,
        30, 150, 30,

        // top rung back
        30, 0, 30,
        100, 0, 30,
        30, 30, 30,
        30, 30, 30,
        100, 0, 30,
        100, 30, 30,

        // middle rung back
        30, 60, 30,
        67, 60, 30,
        30, 90, 30,
        30, 90, 30,
        67, 60, 30,
        67, 90, 30,

        // top
        0, 0, 0,
        100, 0, 0,
        100, 0, 30,
        0, 0, 0,
        100, 0, 30,
        0, 0, 30,

        // top rung right
        100, 0, 0,
        100, 30, 0,
        100, 30, 30,
        100, 0, 0,
        100, 30, 30,
        100, 0, 30,

        // under top rung
        30, 30, 0,
        30, 30, 30,
        100, 30, 30,
        30, 30, 0,
        100, 30, 30,
        100, 30, 0,

        // between top rung and middle
        30, 30, 0,
        30, 30, 30,
        30, 60, 30,
        30, 30, 0,
        30, 60, 30,
        30, 60, 0,

        // top of middle rung
        30, 60, 0,
        30, 60, 30,
        67, 60, 30,
        30, 60, 0,
        67, 60, 30,
        67, 60, 0,

        // right of middle rung
        67, 60, 0,
        67, 60, 30,
        67, 90, 30,
        67, 60, 0,
        67, 90, 30,
        67, 90, 0,

        // bottom of middle rung.
        30, 90, 0,
        30, 90, 30,
        67, 90, 30,
        30, 90, 0,
        67, 90, 30,
        67, 90, 0,

        // right of bottom
        30, 90, 0,
        30, 90, 30,
        30, 150, 30,
        30, 90, 0,
        30, 150, 30,
        30, 150, 0,

        // bottom
        0, 150, 0,
        0, 150, 30,
        30, 150, 30,
        0, 150, 0,
        30, 150, 30,
        30, 150, 0,

        // left side
        0, 0, 0,
        0, 0, 30,
        0, 150, 30,
        0, 0, 0,
        0, 150, 30,
        0, 150, 0
    ]);

    // set F origin 0.5
    const fWidth = 100;
    const fHeight = 150;
    const fDepth = 30;
    const matrix = m4.translate(m4.identify(), fWidth / -2, fHeight / -2, fDepth / -2);
    for (let i = 0; i < positions.length; i += 3) {
        const pos = [positions[i + 0], positions[i + 1], positions[i + 2], 1];
        const vec = m4.transformVector(matrix, pos);
        positions[i + 0] = vec[0];
        positions[i + 1] = vec[1];
        positions[i + 2] = vec[2];
    }

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

main();