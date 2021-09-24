// @ts-check

import * as dat from "../dat.gui.js";
import { m4 } from '../matrix.js';
import { degToRad, radToDeg } from "../utils.js";
import {
    createGL,
    createProgram,
    createShader,
    resize,
} from "../webgl-utils.js";

const VertShader = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    uniform mat4 uMatrix;
    // uniform float uFudgeFactor;
    varying vec4 vColor;

    void main() {
        vColor = aColor;

        vec4 pos = uMatrix * aPosition;

        // float zToDivideBy = 1.0 + pos.z * uFudgeFactor;

        gl_Position = pos;
    }
`;

const FragShader = `
    precision mediump float;
    varying vec4 vColor;

    void main() {
        gl_FragColor = vColor;
    }
`;

let state = {
    position: { x: -150, y: 0, z: -360 },
    rotation: { x: degToRad(190), y: degToRad(40), z: degToRad(320) },
    scale: { x: 1, y: 1, z: 1 },
    perspective: {
        fov: degToRad(60),
        aspect: 1.5,
        near: 1,
        far: 2000,
    },
    /**
     * @type {WebGLRenderingContext} gl
     */
    gl: null,
    program: null,
    positionBuffer: null,
    positionAttrLoc: -1,
    colorUniformLoc: null,
    matrixUniformLoc: null,
    colorBuffer: null,
    colorAttrLoc: -1,
};


const gui = new dat.GUI();

const rotationFolder = gui.addFolder('rotation');
rotationFolder.add(state.rotation, "x", -360, 360).onChange((v) => {
    state.rotation.x = degToRad(v);
    drawScene();
});
rotationFolder.add(state.rotation, "y", -360, 360).onChange((v) => {
    state.rotation.y = degToRad(v);
    drawScene();
});
rotationFolder.add(state.rotation, "z", -360, 360).onChange((v) => {
    state.rotation.z = degToRad(v);
    drawScene();
});

const positionFolder = gui.addFolder('position');
positionFolder.add(state.position, "x", -600, 600).onChange((v) => {
    state.position.x = v;
    drawScene();
});
positionFolder.add(state.position, "y", -600, 600).onChange((v) => {
    state.position.y = v;
    drawScene();
});
positionFolder.add(state.position, "z", -600, 600).onChange((v) => {
    state.position.z = v;
    drawScene();
});


const scaleFolder = gui.addFolder('scale');
scaleFolder.add(state.scale, "x", -3, 3).onChange((v) => {
    state.scale.x = v;
    drawScene();
});
scaleFolder.add(state.scale, "y", -3, 3).onChange((v) => {
    state.scale.y = v;
    drawScene();
});
scaleFolder.add(state.scale, "z", -3, 3).onChange((v) => {
    state.scale.z = v;
    drawScene();
});

const perspectiveFolder = gui.addFolder('perspective');
perspectiveFolder.add(state.perspective, "fov", 0, Math.PI).onChange((v) => {
    state.perspective.fov = v;
    drawScene();
});
perspectiveFolder.add(state.perspective, "near", 1, 500).onChange((v) => {
    state.perspective.near = v;
    drawScene();
});
perspectiveFolder.add(state.perspective, "far", 1, 4000).onChange((v) => {
    state.perspective.far = v;
    drawScene();
});


function main() {
    const gl = createGL();

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VertShader);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FragShader);

    const program = createProgram(gl, vertShader, fragShader);

    const positionAttrLoc = gl.getAttribLocation(program, "aPosition");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const colorAttrLoc = gl.getAttribLocation(program, "aColor");
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColor(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const matrixUniformLoc = gl.getUniformLocation(program, "uMatrix");

    state = {
        ...state,
        gl,
        program,
        positionBuffer,
        positionAttrLoc,
        colorAttrLoc,
        colorBuffer,
        matrixUniformLoc
    };

    drawScene();
}

function drawScene() {
    const {
        gl,
        program,
        positionAttrLoc,
        positionBuffer,
        colorUniformLoc,
        matrixUniformLoc,
        position,
        rotation,
        colorBuffer,
        colorAttrLoc,
        scale,
        perspective,
    } = state;

    resize(gl);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(program);

    //  =====   positions =====
    // 1. активируем сылку на атрибут
    gl.enableVertexAttribArray(positionAttrLoc);
    // 2. глобально устанавлваем текущий буфер
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // 3. Привязывает к атрибуту текущий буфер чтобы брать данные из этого атрибута
    gl.vertexAttribPointer(positionAttrLoc, 3, gl.FLOAT, false, 0, 0);
    // 4. сбрасываем буфер
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // ===== colors =====
    // 1. устанавливаем глобальный текущий буфер
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // 2. активируем сылку на атрибут с которым будем связывать буфер
    gl.enableVertexAttribArray(colorAttrLoc);
    // 3. привязываем буфер к точке связи, в роле которой выступает аттрибут
    // normalize = true, мы говорим переобразить с 0-255 в 0-1
    gl.vertexAttribPointer(colorAttrLoc, 3, gl.UNSIGNED_BYTE, true, 0, 0);
    // 4. сбрасываем буфер
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let matrix = m4.perspective(perspective.fov, gl.canvas.clientWidth / gl.canvas.clientHeight, perspective.near, perspective.far);
    matrix = m4.translate(matrix, position.x, position.y, position.z);
    matrix = m4.xRotate(matrix, rotation.x);
    matrix = m4.yRotate(matrix, rotation.y);
    matrix = m4.zRotate(matrix, rotation.z);
    matrix = m4.scale(matrix, scale.x, scale.y, scale.z);

    gl.uniformMatrix4fv(matrixUniformLoc, false, matrix);

    gl.uniform4fv(colorUniformLoc, [Math.random(), Math.random(), Math.random(), 1.0]);

    // Отрислвываем каждый прямоугольник отдельно
    const primitiveType = gl.TRIANGLES;
    const drawOffset = 0;
    const count = 16 * 6;
    gl.drawArrays(primitiveType, drawOffset, count);
}

/**
 * @param {WebGLRenderingContext} gl
 */
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
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
        ]),
        gl.STATIC_DRAW);
}

/**
 * @param {WebGLRenderingContext} gl 
 */
function setColor(gl) {
    const colors = [
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
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
}

main();
