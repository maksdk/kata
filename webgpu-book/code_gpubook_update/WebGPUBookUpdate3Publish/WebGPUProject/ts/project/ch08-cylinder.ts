import $ from 'jquery';
import { ShapeData } from '../common/shape-data';
import { Ch08Shaders } from '../common/shaders';
import { Ch08 } from './ch08-light';

export class Ch08Shape {
    static async CreateShape() {
        const data = ShapeData.CylinderData(0.7, 1.5, 3, 30);
        Ch08.vertexData = data?.vertexData as Float32Array;
        Ch08.normalData = data?.normalData as Float32Array;
        await Ch08.CreateShape();
    }
}

Ch08Shape.CreateShape();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') Ch08.isAnimation = true;
    else Ch08.isAnimation = false;
    Ch08Shape.CreateShape();
});

$('#btn-redraw').on('click', function(){
    Ch08Shaders.color = $('#id-color').val()?.toString() as string;
    Ch08Shaders.isPhong = $('#id-isphong').val()?.toString() as string;
    Ch08Shaders.ambientIntensity = $('#id-ambient').val()?.toString() as string;
    Ch08Shaders.diffuseIntensity = $('#id-diffuse').val()?.toString() as string;
    Ch08Shaders.specularIntensity= $('#id-specular').val()?.toString() as string;
    Ch08Shaders.shininess= $('#id-shininess').val()?.toString() as string;
    Ch08Shaders.specularColor = $('#id-scolor').val()?.toString() as string;
    Ch08Shape.CreateShape();    
});