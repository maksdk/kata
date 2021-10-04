// @ts-check
import { createGui } from './gui.js';
import { createGL, createProgram, createShader, resize } from '../webgl-utils.js';
import { setVertices, setNormals } from './geometry.js';
import { degToRad, m4, vec3 } from '../math.js';

const VertShader = `
    attribute vec4 aPosition;
    attribute vec3 aNormal;

    uniform mat4 uModelWorldMatrix; // model matrix
    uniform mat4 uViewProjectionWorldMatrix; // mvp matrix
    uniform mat4 uViewProjecInverseTransposeWorldMatrix; // transpose model matrix
    
    uniform vec3 uPointLightWorldPos; // position of point light

    uniform vec3 uViewWorldPos; // position of camera

    varying vec3 vNormal;
    varying vec3 vSurfaceToLight;
    varying vec3 vSurfaceToView;

    void main() {
        gl_Position = uViewProjectionWorldMatrix * aPosition;
    
        vNormal = mat3(uViewProjecInverseTransposeWorldMatrix) * aNormal;

        // get world pos of vertice
        vec3 worldSurfacePos = (uModelWorldMatrix * aPosition).xyz;

        // get vector from surface to light point
        vSurfaceToLight = uPointLightWorldPos - worldSurfacePos;

        // get vector from surface to view
        vSurfaceToView = uViewWorldPos - worldSurfacePos;
    }
    `;

const FragShader = `
    precision mediump float;

    uniform vec4 uColor;

    uniform float uPointLightShininess;
    uniform vec3 uPointLightColor;
    uniform vec3 uPointLightSpecularColor;

    varying vec3 vNormal;
    varying vec3 vSurfaceToLight;
    varying vec3 vSurfaceToView;

    void main() {
        vec3 color = uColor.rgb;
     
        vec3 normalizedNormal = normalize(vNormal);

        vec3 normSurfaceToLightDir = normalize(vSurfaceToLight);

        vec3 normSurfaceToViewDir = normalize(vSurfaceToView);

        vec3 halfVector = normalize(normSurfaceToLightDir + normSurfaceToViewDir);

        // calculate point light
        float light = dot(normalizedNormal, normSurfaceToLightDir);
        
        // calc speculat
        float specular = 0.0;
        if (light > 0.0) {
            specular = pow(dot(normalizedNormal, halfVector), uPointLightShininess);
        }
        
        color *= light * uPointLightColor; 

        color += specular * uPointLightSpecularColor;

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

    const uModelWorldMatrixUniform = gl.getUniformLocation(program, 'uModelWorldMatrix');
    const uViewProjectionWorldMatrixUniform = gl.getUniformLocation(program, 'uViewProjectionWorldMatrix');
    const uViewProjecInverseTransposeWorldMatrixUniform = gl.getUniformLocation(program, 'uViewProjecInverseTransposeWorldMatrix');

    const uPointLightWorldPosUniform = gl.getUniformLocation(program, 'uPointLightWorldPos');
    const uPointLightShininessUniform = gl.getUniformLocation(program, 'uPointLightShininess');
    const uPointLightColorUniform = gl.getUniformLocation(program, 'uPointLightColor');
    const uPointLightSpecularColorUniform = gl.getUniformLocation(program, 'uPointLightSpecularColor');

    const uViewWorldPosUniform = gl.getUniformLocation(program, 'uViewWorldPos');

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
        camera: {
            x: 100,
            y: 0,
            z: 200,
        },
        target: {
            posX: 0,
            posY: 0,
            posZ: 0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            rotX: 0,
            rotY: 0,
            rotZ: 0,
        },
        pointLight: {
            x: 20,
            y: 30,
            z: 50,
            color: { r: 1, g: 1, b: 1 },
            shininess: 1,
            specularColor: { r: 1, g: 1, b: 1 },
        }
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
        const cameraPos = [state.camera.x, state.camera.y, state.camera.z];
        const target = [state.target.posX, state.target.posY, state.target.posZ];
        const up = [0, 1, 0];
        const viewMatrix = m4.inverse(m4.lookAt(cameraPos, target, up));

        // 3. model matrix
        let worldMatrix = m4.identify();
        worldMatrix = m4.translate(worldMatrix, state.target.posX, state.target.posY, state.target.posZ);
        worldMatrix = m4.xRotate(worldMatrix, state.target.rotX);
        worldMatrix = m4.yRotate(worldMatrix, state.target.rotY);
        worldMatrix = m4.zRotate(worldMatrix, state.target.rotZ);
        worldMatrix = m4.translate(worldMatrix, state.target.scaleX, state.target.scaleY, state.target.scaleZ);

        // 4. mvp matrix (model view projection);
        const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
        const worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, worldMatrix);
        gl.uniformMatrix4fv(uViewProjectionWorldMatrixUniform, false, worldViewProjectionMatrix); // mvp

        // inverse and transpose world(model) matrix 
        const worldInverseMatrix = m4.inverse(worldMatrix);
        const worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);
        gl.uniformMatrix4fv(uViewProjecInverseTransposeWorldMatrixUniform, false, worldInverseTransposeMatrix);

        gl.uniformMatrix4fv(uModelWorldMatrixUniform, false, worldMatrix); // model

        gl.uniform4fv(uColorUniform, [0.2, 1, 0.2, 1]);

        gl.uniform3fv(uPointLightWorldPosUniform, [state.pointLight.x, state.pointLight.y, state.pointLight.z]);
        gl.uniform1f(uPointLightShininessUniform, state.pointLight.shininess);
        gl.uniform3fv(uPointLightColorUniform, [state.pointLight.color.r, state.pointLight.color.g, state.pointLight.color.b]);
        gl.uniform3fv(uPointLightSpecularColorUniform, [state.pointLight.specularColor.r, state.pointLight.specularColor.g, state.pointLight.specularColor.b]);

        gl.uniform3fv(uViewWorldPosUniform, [state.camera.x, state.camera.y, state.camera.z]);

        gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
    }

    drawScene();

    createGui(state, drawScene);
}


main();