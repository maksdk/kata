// @ts-check
import { createGui } from './gui.js';
import { createGL, createProgram, createShader, resize } from '../webgl-utils.js';
import { setVertices, setNormals } from './geometry.js';
import { degToRad, m4, vec3 } from '../math.js';

const VertShader = `
    attribute vec4 aPosition;
    attribute vec3 aNormal;

    uniform mat4 uWorldViewProjectionMatrix; // mvp matrix
    // uniform mat4 uWorldMatrix; // model matrix
    uniform mat4 uWorldInverseTransposeMatrix; // transpose model matrix

    varying vec3 vNormal;

    void main() {
        gl_Position = uWorldViewProjectionMatrix * aPosition;
        vNormal = mat3(uWorldInverseTransposeMatrix) * aNormal;
    }
    `;

const FragShader = `
    precision mediump float;

    uniform vec3 uReverseLightDir;
    uniform vec4 uColor;

    varying vec3 vNormal;

    void main() {
        vec3 normalizedNormal = normalize(vNormal);
        float light = dot(normalizedNormal, uReverseLightDir);

        vec4 color = uColor * light; 

        gl_FragColor = vec4(color.rgb, 1.0);
    }
`;




function main() {
    const gl = createGL();
    const vertShader = createShader(gl, gl.VERTEX_SHADER, VertShader);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FragShader);
    const program = createProgram(gl, vertShader, fragShader);

    const aPositionAttrib = gl.getAttribLocation(program, 'aPosition');
    const aNormalAttrib = gl.getAttribLocation(program, 'aNormal');

    const uWorldViewProjectionMatrixUniform = gl.getUniformLocation(program, 'uWorldViewProjectionMatrix');
    const uWorldInverseTransposeMatrixUniform = gl.getUniformLocation(program, 'uWorldInverseTransposeMatrix');
    const uReverseLightDirUniform = gl.getUniformLocation(program, 'uReverseLightDir');
    const uColorUniform = gl.getUniformLocation(program, 'uColor');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setVertices(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);


    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    setNormals(gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const state = {
        xRotation: 0,
        yRotation: 0,
        zRotation: 0,
    };

    function drawScene() {
        // rendering
        resize(gl);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.useProgram(program);

        // postions
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(aPositionAttrib);
        gl.vertexAttribPointer(aPositionAttrib, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // normals
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.enableVertexAttribArray(aNormalAttrib);
        gl.vertexAttribPointer(aNormalAttrib, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        // 1. project matrix
        const fov = degToRad(60);
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const near = 1;
        const far = 2000;
        const projectionMatrix = m4.perspective(fov, aspect, near, far);

        // 2. view matrix
        const cameraPos = [100, 150, 300];
        const target = [0, 35, 0];
        const up = [0, 1, 0];
        const viewMatrix = m4.inverse(m4.lookAt(cameraPos, target, up));

        // 3. model matrix
        let worldMatrix = m4.identify();
        worldMatrix = m4.xRotate(worldMatrix, state.xRotation);
        worldMatrix = m4.yRotate(worldMatrix, state.yRotation);
        worldMatrix = m4.zRotate(worldMatrix, state.zRotation);

        // 4. mvp matrix (model view projection);
        const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
        const worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
        gl.uniformMatrix4fv(uWorldViewProjectionMatrixUniform, false, worldViewProjectionMatrix); // mvp

        // inverse and transpose world(model) matrix 
        const worldInverseMatrix = m4.inverse(worldMatrix);
        const worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);
        gl.uniformMatrix4fv(uWorldInverseTransposeMatrixUniform, false, worldInverseTransposeMatrix); // model

        gl.uniform4fv(uColorUniform, [0.2, 1, 0.2, 1]);

        gl.uniform3fv(uReverseLightDirUniform, vec3.normalize([0.5, 0.7, 1]));

        gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
    }

    drawScene();

    createGui(state, drawScene);
}


main();