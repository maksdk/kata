// @ts-check

import * as dat from "../dat.gui.js";
import {
	createGL,
	createProgram,
	createShader,
	resize,
} from "../webgl-utils.js";


const VertShader = `
    attribute vec2 aPosition;\n
    uniform vec2 uResolution;\n
    uniform vec2 uTranslation;\n
    void main() {\n
        // изменить позицию\n
        vec2 pos = aPosition + uTranslation;\n

        // pixels to 0 - 1\n
        vec2 zeroToOne = pos / uResolution;\n

        // from 0 - 1 to -1 - 1\n
        vec2 clipSpace = zeroToOne * 2.0 - 1.0;\n

        gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);\n
    }\n
`;

const FragShader = `
    precision mediump float;\n
    uniform vec4 uColor;\n
    void main() {\n
        gl_FragColor = uColor;\n
    }\n
`;

let state = {
	x: 100,
	y: 0,
    color: [
        Math.random(),
		Math.random(),
		Math.random(),
		1.0
    ],
    gl: null,
    program: null,
    positionBuffer: null,
    positionAttrLoc: -1,
    resolutionUniformLoc: null,
    colorUniformLoc: null,
    translationUniformLoc: null,
};


const gui = new dat.GUI();
gui.add(state, "x", 0, 600).onChange((v) => {
    state.x = v;
    drawScene();
});
gui.add(state, "y", 0, 600).onChange((v) => {
    state.y = v;
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
	const translationUniformLoc = gl.getUniformLocation(program, "uTranslation");

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
        translationUniformLoc,
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
        translationUniformLoc,
        x,
        y,
        color
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

	gl.uniform4fv(
		colorUniformLoc,
		color
	);

    gl.uniform2fv(translationUniformLoc, [x, y]);

	// Отрислвываем каждый прямоугольник отдельно
	const primitiveType = gl.TRIANGLES;
	const drawOffset = 0;
	const count = 18;
	gl.drawArrays(primitiveType, drawOffset, count);
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
