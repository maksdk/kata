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
    
    uniform vec3 uSpotLightWorldPos; // position of spot light

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
        vSurfaceToLight = uSpotLightWorldPos - worldSurfacePos;

        // get vector from surface to view
        vSurfaceToView = uViewWorldPos - worldSurfacePos;
    }
    `;

const FragShader = `
    precision mediump float;

    uniform vec4 uColor;

    uniform float uSpotLightShininess;
    uniform vec3 uSpotLightColor;
    uniform vec3 uSpotLightSpecularColor;
    uniform vec3 uSpotLightDir;
    uniform float uSpotLightLimit; // cos of angle from 0 - 180 degrees

    varying vec3 vNormal;
    varying vec3 vSurfaceToLight;
    varying vec3 vSurfaceToView;

    void main() {
        // vec3 color = vec3(1.0, 0.0, 0.0);
     
        vec3 normalizedNormal = normalize(vNormal);

        vec3 normSurfaceToLightDir = normalize(vSurfaceToLight);

        vec3 normSurfaceToViewDir = normalize(vSurfaceToView);

        vec3 halfVector = normalize(normSurfaceToLightDir + normSurfaceToViewDir);

        float dotFromDirection =  dot(normSurfaceToLightDir, -uSpotLightDir);
  
        float inLight = smoothstep(uSpotLightLimit * 0.999, uSpotLightLimit * 1.005, dotFromDirection);
        float light = inLight * dot(normalizedNormal, normSurfaceToLightDir);
        
        float specular = inLight * pow(dot(normalizedNormal, halfVector), uSpotLightShininess);

        gl_FragColor = uColor;

        // Lets multiply just the color portion (not the alpha)
        // by the light
        gl_FragColor.rgb *= light;
      
        // Just add in the specular
        gl_FragColor.rgb += specular;
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

    const uSpotLightWorldPosUniform = gl.getUniformLocation(program, 'uSpotLightWorldPos');
    const uSpotLightShininessUniform = gl.getUniformLocation(program, 'uSpotLightShininess');
    const uSpotLightColorUniform = gl.getUniformLocation(program, 'uSpotLightColor');
    const uSpotLightSpecularColorUniform = gl.getUniformLocation(program, 'uSpotLightSpecularColor');
    const uSpotLightLimitUniform = gl.getUniformLocation(program, 'uSpotLightLimit');
    const uSpotLightDirUniform = gl.getUniformLocation(program, 'uSpotLightDir');

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
        light: {
            x: 100,
            y: 0,
            z: 200,
            color: { r: 1, g: 1, b: 1 },
            shininess: 150,
            specularColor: { r: 1, g: 1, b: 1 },
            spotLimit: 10,
            rotX: 0,
            rotY: 0,
            rotZ: 0,
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
        worldMatrix = m4.scale(worldMatrix, state.target.scaleX, state.target.scaleY, state.target.scaleZ);

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

        gl.uniform3fv(uViewWorldPosUniform, [state.camera.x, state.camera.y, state.camera.z]);

        gl.uniform3fv(uSpotLightWorldPosUniform, [state.light.x, state.light.y, state.light.z]);
        gl.uniform1f(uSpotLightShininessUniform, state.light.shininess);
        gl.uniform3fv(uSpotLightColorUniform, [state.light.color.r, state.light.color.g, state.light.color.b]);
        gl.uniform3fv(uSpotLightSpecularColorUniform, [state.light.specularColor.r, state.light.specularColor.g, state.light.specularColor.b]);
        gl.uniform1f(uSpotLightLimitUniform, Math.cos(degToRad(state.light.spotLimit)));
        {
            let spotLightMat = m4.lookAt(
                [state.light.x, state.light.y, state.light.z],
                [state.target.posX, state.target.posY, state.target.posZ],
                up
            );
            spotLightMat = m4.xRotate(spotLightMat, state.light.rotX);
            spotLightMat = m4.yRotate(spotLightMat, state.light.rotY);
            spotLightMat = m4.zRotate(spotLightMat, state.light.rotZ);

            const spotLightDir = [-spotLightMat[8], -spotLightMat[9], -spotLightMat[10]];
            gl.uniform3fv(uSpotLightDirUniform, spotLightDir);

        }

        gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
    }

    drawScene();

    createGui(state, drawScene);
}


main();