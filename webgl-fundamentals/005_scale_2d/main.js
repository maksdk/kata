// @ts-check

import * as dat from "../dat.gui.js";
import {
	createGL,
	createProgram,
	createShader,
	resize,
} from "../webgl-utils.js";


const VertShader = `
    attribute vec2 aPosition;

    uniform vec2 uResolution;
    uniform vec2 uTranslation;
    uniform float uRotation;
    uniform vec2 uScale;

    void main() {
        // Apply scaling
        vec2 pos = aPosition * uScale;

        // Применить поворот
        pos = vec2(
            pos.x * sin(uRotation) + pos.y * cos(uRotation),
            pos.y * sin(uRotation) - pos.x * cos(uRotation)
        );

        // изменить позицию
        pos = pos + uTranslation;

        // pixels to 0 - 1
        vec2 zeroToOne = pos / uResolution;

        // from 0 - 1 to -1 - 1
        vec2 clipSpace = zeroToOne * 2.0 - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
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
    position: {x: 200, y: 200 },
    rotation: 90,
    scale: { x: 1, y: 1 },
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
    rotationUniformLoc: null,
    scaleUniformLoc: null,
};


const gui = new dat.GUI();

gui.add(state, 'rotation', 0, 360).onChange((v) => {
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
scaleFolder.add(state.scale, "x", 0, 3).onChange((v) => {
    state.scale.x = v;
    drawScene();
});
scaleFolder.add(state.scale, "y", 0, 3).onChange((v) => {
    state.scale.y = v;
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
	const rotationUniformLoc = gl.getUniformLocation(program, "uRotation");
	const scaleUniformLoc = gl.getUniformLocation(program, "uScale");

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
        rotationUniformLoc,
        scaleUniformLoc,
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
        rotationUniformLoc,
        scaleUniformLoc,
        position,
        rotation,
        color,
        scale,
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

	gl.uniform4fv(colorUniformLoc, color);

    gl.uniform2fv(scaleUniformLoc, [scale.x, scale.y]);
    gl.uniform1f(rotationUniformLoc, rotation * (Math.PI / 180));
    gl.uniform2fv(translationUniformLoc, [position.x, position.y]);

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
