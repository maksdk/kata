// @ts-check

// Initialize
// 1) Find canvas
// 2) Get Webgl context
// 3) Init fragment and vertex shaders
// 4) Create shaders
// 5) Create program and attach created shaders to the program
// 6) Pass data to program - attribute (aPosition)
// 7) Get link to attribute when we call initialize function
// 8) Attributes get data from buffers, so we need to create the buffer
// 9) Webgl manages processes using 'point of connections', so we need to bind out buffer to this point
// 10) After we binded the buffer we can fill it data

// Rendering
// 1) Set canvas size. Canvas has 2 sizes: the first is for drawing buffer; the second is for css.  Browser takes 'buffer size' and tries to fit it to 'css size'. If css does not have size, it uses 'buffer' size.
// 2) Clear canvas color buffer
// 3) Say to webgl what thee program to use
// 4) Here we need to say webgl how it can get buffer's data:
//      1. Enable attribute
//      2. Bind buffer
//      3. Say how to get data
// 5) Say to webgl to execute our program

const VertShader = `
    attribute vec2 aPosition;\n
    uniform vec2 uResolution;
    void main() {\n
        // pixels to 0 - 1\n
        vec2 zeroToOne = aPosition / uResolution;\n

        // from 0 - 1 to -1 - 1\n
        vec2 clipSpace = zeroToOne * 2.0 - 1.0;\n

        gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);\n
    }
`;

const FragShader = `
    precision mediump float;\n
    uniform vec4 uColor;\n
    void main() {\n
        gl_FragColor = uColor;\n
    }
`;

/**
 * @param {WebGLRenderingContext} gl
 * @param {Number} type
 * @param {String} source
 * @returns {WebGLShader}
 */
function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}

	console.error("Error - createShader.", gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertShader
 * @param {WebGLShader} fragShader
 * @returns {WebGLProgram}
 */
function createProgram(gl, vertShader, fragShader) {
	const program = gl.createProgram();
	gl.attachShader(program, vertShader);
	gl.attachShader(program, fragShader);
	gl.linkProgram(program);

	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	}

	console.error("Error - createProgram.", gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

/**
 * @param {WebGLRenderingContext} gl
 */
function resize(gl) {
	const displayWidth = gl.canvas.clientWidth;
	const displayHeight = gl.canvas.clientHeight;

	if (
		displayWidth !== gl.canvas.width ||
		displayHeight !== gl.canvas.height
	) {
		gl.canvas.width = displayWidth;
		gl.canvas.height = displayHeight;
	}
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

/**
 * @param {Object} context
 * @param {WebGLRenderingContext} context.gl
 * @param {WebGLProgram} context.program
 * @param {WebGLBuffer} context.positionBuffer
 * @param {Number} context.positionAttrLoc
 * @param {WebGLUniformLocation} context.resolutionUniformLoc
 * @param {WebGLUniformLocation} context.colorUniformLoc
 */
function drawScene(context) {
	const {
		gl,
		program,
		positionAttrLoc,
		positionBuffer,
		resolutionUniformLoc,
		colorUniformLoc,
	} = context;

	resize(gl);

	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program);

	gl.enableVertexAttribArray(positionAttrLoc);

	// 1 Активируем буфер в который будем дальше записывать данные
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	const size = 2;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;

	// 2 Привязывает к атрибуту текущий буфер чтобы брать данные из этого атрибута
	gl.vertexAttribPointer(
		positionAttrLoc,
		size,
		type,
		normalize,
		stride,
		offset
	);

	gl.uniform2f(resolutionUniformLoc, gl.canvas.width, gl.canvas.height);

	for (let i = 0; i < 50; i++) {
		// 3 Это будет записано в positionBuffer c помощью - gl.bufferData, так как мы его забиндили к gl.Array_Buffer последним
		// И этот буфер использует атрибуд aPosition
		setRectangleBufferData(
			gl,
			randomInt(300),
			randomInt(300),
			randomInt(300),
			randomInt(300)
		);

		gl.uniform4f(
			colorUniformLoc,
			Math.random(),
			Math.random(),
			Math.random(),
			1.0
		);

		// Отрислвываем каждый прямоугольник отдельно
		const primitiveType = gl.TRIANGLES;
		const drawOffset = 0;
		const count = 6;
		gl.drawArrays(primitiveType, drawOffset, count);
	}
}

function init() {
	// 1) First part only to initialize

	/**
	 * @type {HTMLCanvasElement}
	 */
	const canvas = document.querySelector("#c");
	/**
	 * @type {WebGLRenderingContext}
	 */
	const gl = canvas.getContext("webgl");
	if (!gl) {
		throw new Error("Webgl context is not found");
	}

	const vertShader = createShader(gl, gl.VERTEX_SHADER, VertShader);
	const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FragShader);

	const program = createProgram(gl, vertShader, fragShader);

	const positionAttrLoc = gl.getAttribLocation(program, "aPosition");
	const positionBuffer = gl.createBuffer();
	const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	const resolutionUniformLoc = gl.getUniformLocation(program, "uResolution");
	const colorUniformLoc = gl.getUniformLocation(program, "uColor");

	// 2) Second part - rendering. This part is called each times when we want to draw
	drawScene({
		gl,
		program,
		positionBuffer,
		positionAttrLoc,
		resolutionUniformLoc,
		colorUniformLoc,
	});
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 */
function setRectangleBufferData(gl, x, y, width, height) {
	const x1 = x;
	const y1 = y;
	const x2 = x + width;
	const y2 = y + height;

	const positions = [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
}

/**
 * @param {Number} range
 * @returns {Number}
 */
function randomInt(range) {
	return Math.floor(Math.random() * range);
}

init();
