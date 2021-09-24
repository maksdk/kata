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
import { setColor, setGeometry } from "./buffers.js";

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
    cameraAngle: degToRad(0),
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

gui.add(state, 'cameraAngle', -Math.PI, Math.PI).onChange((v) => {
    state.cameraAngle = v;
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
        cameraAngle
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

    gl.uniform4fv(colorUniformLoc, [Math.random(), Math.random(), Math.random(), 1.0]);

    const countFs = 10;
    const radius = 200;
    const targetPosition = [radius, 0, 0];
    const up = [0, 1, 0];

    const projectionMatrix = m4.perspective(perspective.fov, gl.canvas.clientWidth / gl.canvas.clientHeight, perspective.near, perspective.far);

    let cameraMatrix = m4.yRotation(cameraAngle);
    cameraMatrix = m4.translate(cameraMatrix, 0, radius, radius * 4);
    const cameraPos = [
        cameraMatrix[12],
        cameraMatrix[13],
        cameraMatrix[14]
    ];
    cameraMatrix = m4.lookAt(cameraPos, targetPosition, up);

    const viewMatrix = m4.inverse(cameraMatrix);

    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    for (let i = 0; i < countFs; i++) {
        const angle = Math.PI * 2 / countFs * i;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const matrix = m4.translate(viewProjectionMatrix, x, 0, y);

        gl.uniformMatrix4fv(matrixUniformLoc, false, matrix);

        // Отрислвываем каждый прямоугольник отдельно
        const primitiveType = gl.TRIANGLES;
        const drawOffset = 0;
        const count = 16 * 6;
        gl.drawArrays(primitiveType, drawOffset, count);
    }
}

main();
