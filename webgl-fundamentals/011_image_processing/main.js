// @ts-check

import { createGL, createProgram, createShader, resize } from '../webgl-utils.js';

const VertShader = `
    attribute vec2 aPosition;
    attribute vec2 aTextureCoord;
    varying vec2 vTextureCoord;

    uniform vec2 uResolution;

    void main() {
        vTextureCoord = aTextureCoord;

        vec2 coord = aPosition / uResolution * 2.0 - 1.0;
    
        // dont forget to flip Y or use gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL)
        // gl_Position = vec4(coord * vec2(1, -1), 0.0, 1.0);
        gl_Position = vec4(coord, 0.0, 1.0);
    }
`;

const FragShader = `
    precision mediump float;

    uniform sampler2D uImage;
    varying vec2 vTextureCoord;

    void main() {
        // gl_FragColor = texture2D(uImage, vTextureCoord);

        // change red and blue by places
        gl_FragColor = texture2D(uImage, vTextureCoord).bgra;
        // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;


let state = {
    img: null,
};

function preload(cb) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = 'https://webglfundamentals.org/webgl/resources/leaves.jpg';
    img.onload = cb;
    img.onerror = (e) => console.error('Image loading error: ', e);
    state.img = img;
}

function main() {
    const gl = createGL();
    const vertShader = createShader(gl, gl.VERTEX_SHADER, VertShader);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FragShader);
    const program = createProgram(gl, vertShader, fragShader);

    const positionAttribLoc = gl.getAttribLocation(program, 'aPosition');
    const textureCoordAttribLoc = gl.getAttribLocation(program, 'aTextureCoord');
    const imageUniformLoc = gl.getUniformLocation(program, 'uImage');
    const reolutionUniformLoc = gl.getUniformLocation(program, 'uResolution');

    // positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangle(gl, 0, 0, state.img.width, state.img.height);

    gl.enableVertexAttribArray(positionAttribLoc);
    gl.vertexAttribPointer(positionAttribLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // texture
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
    ]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(textureCoordAttribLoc);
    gl.vertexAttribPointer(textureCoordAttribLoc, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // texture
    // 1. create teature
    const texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip Y coord or do it in fragment shader

    // 2. global activate texture
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 3.set texture params
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // 4. upload image to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, state.img);


    // rendering
    resize(gl);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform2fv(reolutionUniformLoc, [gl.canvas.clientWidth, gl.canvas.clientHeight]);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function setRectangle(gl, x, y, width, height) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}

preload(main);
