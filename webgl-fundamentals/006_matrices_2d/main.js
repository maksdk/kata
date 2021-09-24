// @ts-check

import * as dat from "../dat.gui.js";
import { m3 } from '../math.js';
import {
    createGL,
    createProgram,
    createShader,
    resize,
} from "../webgl-utils.js";


// Для вычисленя матриц нам нужно расположение [x, y, z] умножить на каждую колонку матрицы
//               [1, 2, 3]    [x * 1 + y * 4 + z * 7]
// [x, y, z]  *  [4, 5, 6]  = [x * 2 + y * 5 + z * 8]
//               [7, 8, 9]    [x * 3 + y * 6 + z * 9]

//               [1,  0,  0]    [x + tx]
// [x, y, z]  *  [0,  1,  0]  = [y + ty]
//               [tx, ty, 1]    [z]


//             [c, -s, 0]    [x * c +  y * s + z * 0]
// [x, y, z] * [s,  c, 0]  = [x * -s + y * c + z * 0]
//             [0,  0, 1]    [x * 0 +  y * 0 + z * 1]


//             [sx,  0, 0]    [x * sx]
// [x, y, z] * [0,  sy, 0] =  [y * sy]
//             [0,   0, 1]    [z]


const VertShader = `
    attribute vec2 aPosition;
    uniform mat3 uMatrix;

    void main() {
        // Apply matrix
        vec2 pos = (uMatrix * vec3(aPosition, 1.0)).xy;
        gl_Position = vec4(pos.xy, 0.0, 1.0);
    }
`;

const FragShader = `
    precision mediump float;

    uniform vec4 uColor;

    void main() {
        gl_FragColor = uColor;
    }
`;

let state = {
    width: 100,
    height: 150,
    position: { x: 100, y: 100 },
    rotation: 0,
    scale: { x: 0.9, y: 0.9 },
    origin: { x: -0.5, y: -0.5 },
    /**
     * @type {WebGLRenderingContext} gl
     */
    gl: null,
    program: null,
    positionBuffer: null,
    positionAttrLoc: -1,
    resolutionUniformLoc: null,
    colorUniformLoc: null,
    matrixUniformLoc: null,
};


const gui = new dat.GUI();

gui.add(state, 'rotation', -360, 360).onChange((v) => {
    state.rotation = v;
    drawScene();
});

const positionFolder = gui.addFolder('position');
positionFolder.add(state.position, "x", 0, 600).onChange((v) => {
    state.position.x = v;
    drawScene();
});
positionFolder.add(state.position, "y", 0, 600).onChange((v) => {
    state.position.y = v;
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


const originFolder = gui.addFolder('origin');
originFolder.add(state.origin, "x", -1, 1).onChange((v) => {
    state.origin.x = v;
    drawScene();
});
originFolder.add(state.origin, "y", -1, 1).onChange((v) => {
    state.origin.y = v;
    drawScene();
});

function main() {
    const gl = createGL();

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VertShader);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FragShader);

    const program = createProgram(gl, vertShader, fragShader);

    const positionAttrLoc = gl.getAttribLocation(program, "aPosition");
    const positionBuffer = gl.createBuffer();

    const resolutionUniformLoc = gl.getUniformLocation(program, "uResolution");
    const colorUniformLoc = gl.getUniformLocation(program, "uColor");
    const matrixUniformLoc = gl.getUniformLocation(program, "uMatrix");

    // Set data for positions
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    state = {
        ...state,
        gl,
        program,
        positionBuffer,
        positionAttrLoc,
        resolutionUniformLoc,
        colorUniformLoc,
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
        resolutionUniformLoc,
        colorUniformLoc,
        matrixUniformLoc,
        position,
        rotation,
        scale,
        origin,
        width,
        height
    } = state;

    resize(gl);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    //  =====   positions =====
    // 1 активируем сылку на атрибут
    gl.enableVertexAttribArray(positionAttrLoc);
    // 2 глобально устанавлваем текущий буфер
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 2 Привязывает к атрибуту текущий буфер чтобы брать данные из этого атрибута
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
        positionAttrLoc,
        size,
        type,
        normalize,
        stride,
        offset
    );

    gl.uniform2f(resolutionUniformLoc, gl.canvas.width, gl.canvas.height);


    const projectionMatrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    const translationMatrix = m3.translation(position.x, position.y);
    const rotationMatrix = m3.rotation(rotation * (Math.PI / 180));
    const scalingMatrix = m3.scaling(scale.x, scale.y);

    const moveOriginalMatrix = m3.translation(origin.x * width, origin.y * height);

    let matrix = m3.identify();

    for (let i = 0; i < 1; i++) {
        matrix = m3.multiply(matrix, projectionMatrix);
        matrix = m3.multiply(matrix, translationMatrix);
        matrix = m3.multiply(matrix, rotationMatrix);
        matrix = m3.multiply(matrix, scalingMatrix);
        matrix = m3.multiply(matrix, moveOriginalMatrix);

        gl.uniformMatrix3fv(matrixUniformLoc, false, matrix);

        gl.uniform4fv(colorUniformLoc, [Math.random(), Math.random(), Math.random(), 1.0]);

        // Отрислвываем каждый прямоугольник отдельно
        const primitiveType = gl.TRIANGLES;
        const drawOffset = 0;
        const count = 18;
        gl.drawArrays(primitiveType, drawOffset, count);
    }
}

/**
 * @param {WebGLRenderingContext} gl
 */
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,

            // top rung
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,

            // middle rung
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ]),
        gl.STATIC_DRAW);
}

main();
