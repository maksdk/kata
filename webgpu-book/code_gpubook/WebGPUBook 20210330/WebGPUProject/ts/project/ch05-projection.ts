import { mat4 } from 'gl-matrix';
import { Transforms } from '../common/transforms';
import $ from 'jquery';
import { NavBar } from '../common/navbar';

export class Projection{
    static CreateViewMatrix() {
        const viewMat = mat4.lookAt(mat4.create(),[3, 4, 5],[-3, -4, -5], [0, 1, 0]);
        $('#id_webgpu').append(`<h3>View Transform:</h3>Camera position: [3, 4, 5], 
                                Look at direction: [-3, -4, -5], Up direction: [0, 1, 0] ` );
        $('#id_webgpu').append(`<br><b>Viewing Matrix:</b><br> viewMat = ${Transforms.Round(viewMat, 3)}<br>` );
    }

    static CreateFrustum(){
        const left = -3;
        const right = 3;
        const bottom = -5;
        const top = 5;
        const near = -1;
        const far = -100;

        const frustumMat = mat4.frustum(mat4.create(), left, right, bottom, top, near, far);
        $('#id_webgpu').append(`<br><h3>Frustum Matrix:</h3>frustumMat = ${Transforms.Round(frustumMat, 3)}<br>` );
    }

    static CreatePerspective(){
        const fovy = Math.PI/6;
        const aspect = 1.5;       
        const near = -1;
        const far = -100;

        const perspMat = mat4.perspective(mat4.create(), fovy, aspect, near, far);
        $('#id_webgpu').append(`<br><h3>Perspective Projection Matrix:</h3>perspMat = ${Transforms.Round(perspMat, 3)}<br>` );
    }

    static CreateOrtho(){
        const left = -3;
        const right = 3;
        const bottom = -5;
        const top = 5;
        const near = -1;
        const far = -100;

        const orthoMat = mat4.ortho(mat4.create(), left, right, bottom, top, near, far);
        $('#id_webgpu').append(`<br><h3>Orthographic Projection Matrix:</h3>orthoMat = ${Transforms.Round(orthoMat, 3)}<br>` );
    }
}

Projection.CreateViewMatrix();
Projection.CreateFrustum();
Projection.CreatePerspective();
Projection.CreateOrtho();
