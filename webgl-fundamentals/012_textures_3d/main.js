// @ts-check

import { createGL, createProgram, createShader, resize } from '../webgl-utils.js';
import { m4 } from '../math.js';
import { degToRad } from '../utils.js';

/**
 * @typedef {Object} IState
 * @property {WebGLRenderingContext} gl
 * @property {WebGLProgram} program
 * @property {WebGLBuffer} positionBuffer
 * @property {WebGLBuffer} colorBuffer
 * @property {WebGLBuffer} texCoordBuffer
 * @property {number} positionAttribLoc
 * @property {WebGLUniformLocation} matrixUniformLoc
 * @property {WebGLUniformLocation} imageUniformLoc
 * @property {number} colorAttribLoc
 * @property {number} texCoordAttribLoc
 */

const VertShader = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    attribute vec2 aTexCoord;
    
    uniform mat4 uMvpMatrix;

    varying vec4 vColor;
    varying vec2 vTexCoord;

    void main() {
        vColor = aColor;
        vTexCoord = aTexCoord;
        gl_Position = uMvpMatrix * aPosition;
    }
`;

const FragShader = `
    precision mediump float;

    uniform sampler2D uImage;

    varying vec2 vTexCoord;
    varying vec4 vColor;

    void main() {
        gl_FragColor = texture2D(uImage, vTexCoord);
    }
`;


let xMatrixRot = 0;
let yMatrixRot = 0;

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

    const colorAttribLoc = gl.getAttribLocation(program, 'aColor');
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColor(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const texCoordAttribLoc = gl.getAttribLocation(program, 'aTexCoord');
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    setTexCoord(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const matrixUniformLoc = gl.getUniformLocation(program, 'uMvpMatrix');

    const imageUniformLoc = gl.getUniformLocation(program, 'uImage');

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

    const image = new Image();
    image.src = "https://webglfundamentals.org/webgl/resources/f-texture.png";
    image.crossOrigin = 'anonymous';
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        // generate mipmap - эта функцуя создает мипматы для текстуры, создавая новую текстуру в 4 раза меньше предыдущей
    };

    drawScene({
        gl,
        program,
        positionBuffer,
        positionAttribLoc,
        matrixUniformLoc,
        colorBuffer,
        colorAttribLoc,
        texCoordAttribLoc,
        texCoordBuffer,
        imageUniformLoc
    });
}


/**
 * @param {IState} state 
 */
function drawScene(state) {
    const {
        gl,
        program,
        positionBuffer,
        positionAttribLoc,
        matrixUniformLoc,
        colorBuffer,
        colorAttribLoc,
        texCoordAttribLoc,
        texCoordBuffer
    } = state;

    resize(gl);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST | gl.DEPTH_BUFFER_BIT);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    // positions
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttribLoc);
    gl.vertexAttribPointer(positionAttribLoc, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    // colors
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(colorAttribLoc);
    gl.vertexAttribPointer(colorAttribLoc, 3, gl.UNSIGNED_BYTE, true, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    // texture coords
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.enableVertexAttribArray(texCoordAttribLoc);
    gl.vertexAttribPointer(texCoordAttribLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


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


/**
 * @param {WebGLRenderingContext} gl
 */
// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
    const positions = new Float32Array([
        // left column front
        0, 0, 0,
        0, 150, 0,
        30, 0, 0,
        0, 150, 0,
        30, 150, 0,
        30, 0, 0,

        // top rung front
        30, 0, 0,
        30, 30, 0,
        100, 0, 0,
        30, 30, 0,
        100, 30, 0,
        100, 0, 0,

        // middle rung front
        30, 60, 0,
        30, 90, 0,
        67, 60, 0,
        30, 90, 0,
        67, 90, 0,
        67, 60, 0,

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
        30, 60, 30,
        30, 30, 30,
        30, 30, 0,
        30, 60, 0,
        30, 60, 30,

        // top of middle rung
        30, 60, 0,
        67, 60, 30,
        30, 60, 30,
        30, 60, 0,
        67, 60, 0,
        67, 60, 30,

        // right of middle rung
        67, 60, 0,
        67, 90, 30,
        67, 60, 30,
        67, 60, 0,
        67, 90, 0,
        67, 90, 30,

        // bottom of middle rung.
        30, 90, 0,
        30, 90, 30,
        67, 90, 30,
        30, 90, 0,
        67, 90, 30,
        67, 90, 0,

        // right of bottom
        30, 90, 0,
        30, 150, 30,
        30, 90, 30,
        30, 90, 0,
        30, 150, 0,
        30, 150, 30,

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


/**
 * @param {WebGLRenderingContext} gl
 */
function setColor(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
        // left column front
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,

        // top rung front
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,

        // middle rung front
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,
        200, 70, 120,

        // left column back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // top rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // middle rung back
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,
        80, 70, 200,

        // top
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,
        70, 200, 210,

        // top rung right
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,
        200, 200, 70,

        // under top rung
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,
        210, 100, 70,

        // between top rung and middle
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,
        210, 160, 70,

        // top of middle rung
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,
        70, 180, 210,

        // right of middle rung
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,
        100, 70, 210,

        // bottom of middle rung.
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,
        76, 210, 100,

        // right of bottom
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,
        140, 210, 80,

        // bottom
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,
        90, 130, 110,

        // left side
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220,
        160, 160, 220
    ]), gl.STATIC_DRAW);
}


/**
 * @param {WebGLRenderingContext} gl
 */
function setTexCoord(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column front
            38 / 255, 44 / 255,
            38 / 255, 223 / 255,
            113 / 255, 44 / 255,
            38 / 255, 223 / 255,
            113 / 255, 223 / 255,
            113 / 255, 44 / 255,

            // top rung front
            113 / 255, 44 / 255,
            113 / 255, 85 / 255,
            218 / 255, 44 / 255,
            113 / 255, 85 / 255,
            218 / 255, 85 / 255,
            218 / 255, 44 / 255,

            // middle rung front
            113 / 255, 112 / 255,
            113 / 255, 151 / 255,
            203 / 255, 112 / 255,
            113 / 255, 151 / 255,
            203 / 255, 151 / 255,
            203 / 255, 112 / 255,

            // left column back
            38 / 255, 44 / 255,
            113 / 255, 44 / 255,
            38 / 255, 223 / 255,
            38 / 255, 223 / 255,
            113 / 255, 44 / 255,
            113 / 255, 223 / 255,

            // top rung back
            113 / 255, 44 / 255,
            218 / 255, 44 / 255,
            113 / 255, 85 / 255,
            113 / 255, 85 / 255,
            218 / 255, 44 / 255,
            218 / 255, 85 / 255,

            // middle rung back
            113 / 255, 112 / 255,
            203 / 255, 112 / 255,
            113 / 255, 151 / 255,
            113 / 255, 151 / 255,
            203 / 255, 112 / 255,
            203 / 255, 151 / 255,

            // top
            0, 0,
            1, 0,
            1, 1,
            0, 0,
            1, 1,
            0, 1,

            // top rung right
            0, 0,
            1, 0,
            1, 1,
            0, 0,
            1, 1,
            0, 1,

            // under top rung
            0, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 1,
            1, 0,

            // between top rung and middle
            0, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,

            // top of middle rung
            0, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,

            // right of middle rung
            0, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,

            // bottom of middle rung.
            0, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 1,
            1, 0,

            // right of bottom
            0, 0,
            1, 1,
            0, 1,
            0, 0,
            1, 0,
            1, 1,

            // bottom
            0, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 1,
            1, 0,

            // left side
            0, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 1,
            1, 0,
        ]),
        gl.STATIC_DRAW);
}

main();