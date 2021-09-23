// @ts-check

import {
	createGL,
	createProgram,
	createShader,
	resize,
} from "../webgl-utils.js";

const VertShader = `
    attribute vec2 aPosition;\n
    attribute vec4 aColor;
    uniform vec2 uResolution;
    varying vec4 uColor;\n
    void main() {\n
        uColor = aColor;

        // pixels to 0 - 1\n
        vec2 zeroToOne = aPosition / uResolution;\n

        // from 0 - 1 to -1 - 1\n
        vec2 clipSpace = zeroToOne * 2.0 - 1.0;\n

        vec4 pos = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);\n

        gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);\n
    }
`;

const FragShader = `
    precision mediump float;\n
    varying vec4 uColor;\n
    void main() {\n
        gl_FragColor = uColor;\n
    }
`;

function main() {
	const gl = createGL();

	const vertShader = createShader(gl, gl.VERTEX_SHADER, VertShader);
	const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FragShader);

	const program = createProgram(gl, vertShader, fragShader);

	const positionAttrLoc = gl.getAttribLocation(program, "aPosition");
	const positionBuffer = gl.createBuffer();

	const colorAttrLoc = gl.getAttribLocation(program, "aColor");
	const colorBuffer = gl.createBuffer();

	const resolutionUniformLoc = gl.getUniformLocation(program, "uResolution");

	// Set data for positions
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	setGeometry(gl);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// Set data for colors
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	setColors(gl);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	drawScene({
		gl,
		program,
		positionBuffer,
		positionAttrLoc,
		resolutionUniformLoc,
		colorAttrLoc,
		colorBuffer,
	});
}

/**
 * @param {Object} context
 * @param {WebGLRenderingContext} context.gl
 * @param {WebGLProgram} context.program
 * @param {WebGLBuffer} context.positionBuffer
 * @param {Number} context.positionAttrLoc
 * @param {WebGLBuffer} context.colorBuffer
 * @param {Number} context.colorAttrLoc
 * @param {WebGLUniformLocation} context.resolutionUniformLoc
 */
function drawScene(context) {
	const {
		gl,
		program,
		positionAttrLoc,
		positionBuffer,
		resolutionUniformLoc,
		colorBuffer,
		colorAttrLoc,
	} = context;

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

	// =====   colors =====
	gl.enableVertexAttribArray(colorAttrLoc);
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(colorAttrLoc, 4, gl.FLOAT, false, 0, 0);

	gl.uniform2f(resolutionUniformLoc, gl.canvas.width, gl.canvas.height);

	// Отрислвываем каждый прямоугольник отдельно
	const primitiveType = gl.TRIANGLES;
	const drawOffset = 0;
	const count = 6;
	gl.drawArrays(primitiveType, drawOffset, count);
}

/**
 * @param {WebGLRenderingContext} gl
 */
function setGeometry(gl) {
	const position = [50, 100, 350, 100, 50, 300, 350, 100, 50, 300, 350, 300];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
}

/**
 * @param {WebGLRenderingContext} gl
 */
function setColors(gl) {
	const r1 = Math.random();
	const b1 = Math.random();
	const g1 = Math.random();
	const r2 = Math.random();
	const b2 = Math.random();
	const g2 = Math.random();

	// pritter-ignore
	const colors = [
		r1,
		b1,
		g1,
		1,
		r1,
		b1,
		g1,
		1,
		r1,
		b1,
		g1,
		1,
		r2,
		b2,
		g2,
		1,
		r2,
		b2,
		g2,
		1,
		r2,
		b2,
		g2,
		1,
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
}

main();
