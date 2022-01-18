import { vec4, mat4 } from 'gl-matrix';
import { Transforms } from '../common/transforms';
import $ from 'jquery';

export class Ch05Transform{
    static CreateScale() {        
        //create original vector:
        let myVec = vec4.fromValues(1, 2, 3, 1);
        
        //create scale matrix:
        const myMat = mat4.fromScaling(mat4.create(), [0.5, 0.5, 1.5]);
        
        //get the scaled vector:
        let scaledVec = vec4.transformMat4(vec4.create(),myVec,myMat);
        $('#id_webgpu').append(`<h3>Scaling:</h3><b>Original vector:</b><br> myVec = ${myVec}` );
        $('#id_webgpu').append(`<br><b>Scaling matrix:</b><br> myMat = ${myMat}` );
        $('#id_webgpu').append(`<br><b>Vector after scaling:</b><br> scaledVec = 
                                myMat * myVec = ${scaledVec}` );

        //two successive scaling transforms:
        //get total scaling matrix after another scaling transformation:
        const scalingMat = mat4.scale(mat4.create(), myMat, [1, 0.5, 0.3]);
        
        //get final scaled vector:
        vec4.transformMat4(scaledVec,myVec,scalingMat);
        $('#id_webgpu').append(`<br><b>Total scaling matrix after two scalings:</b><br> 
                                scalingMat = ${Transforms.Round(scalingMat, 3)}` );
        $('#id_webgpu').append(`<br><b>Vector after two scalings:</b><br> scaledVec = 
                                scalingMat * myVec = ${Transforms.Round(scaledVec, 3)}` );
    }

    static CreateTranslation(){
        //create original vector:
        let myVec = vec4.fromValues(1, 2, 3, 1);
        
        //create first translation matrix:
        const myMat =  mat4.fromTranslation(mat4.create(), [2, 2.5, 3]);

        //get total translation matrix after another translation:
        const transMat = mat4.translate(mat4.create(), myMat, [-3, -2, -1]);

        //get final translated vector:
        const transVec = vec4.transformMat4(vec4.create(), myVec, transMat);
        $('#id_webgpu').append(`<br><br><h3>Translation</h3><b>Original vector:</b> myVec = ${myVec}` );
        $('#id_webgpu').append(`<br><b>Total translation matrix after two translations:</b><br> 
                                transMat = ${transMat}` );
        $('#id_webgpu').append(`<br><b>Vector after two translations:</b><br> transVec = 
                                transMat * myVec = ${transVec}` );
    }

    static CreateRotation(){
        //create original vector:
        let myVec = vec4.fromValues(1, 2, 3, 1);

        //create a rotation matrix around the z axis by 20 degrees:
        const rotMatz = mat4.fromZRotation(mat4.create(), 20*Math.PI/180);
        
        //get the total rotation matrix after another rotation around the z axis by 25 degrees:
        const rotMat = mat4.rotateZ(mat4.create(), rotMatz, 25*Math.PI/180);

        //get final rotated vector:
        const rotVec = vec4.transformMat4(vec4.create(), myVec, rotMat);
       
        //output results:
        $('#id_webgpu').append(`<br><br><h3>Rotation</h3><b>Original vector:</b> myVec = ${myVec}` );
        $('#id_webgpu').append(`<br><b>Total rotation matrix after two rotations:</b><br> rotMat = ${Transforms.Round(rotMat, 3)}` );
        $('#id_webgpu').append(`<br><b>Vector after two rotations:</b><br> rotVec = rotMat * myVec = ${Transforms.Round(rotVec, 3)}` ); 
    }
}

Ch05Transform.CreateScale();
Ch05Transform.CreateTranslation();
Ch05Transform.CreateRotation();
