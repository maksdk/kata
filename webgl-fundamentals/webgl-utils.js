/**
 * @param {WebGLRenderingContext} gl
 * @param {Number} type
 * @param {String} source
 * @returns {WebGLShader}
 */
export function createShader(gl, type, source) {
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
export function createProgram(gl, vertShader, fragShader) {
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
export function resize(gl) {
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
 * @returns {WebGLRenderingContext}
 */
export function createGL() {
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

	return gl;
}
