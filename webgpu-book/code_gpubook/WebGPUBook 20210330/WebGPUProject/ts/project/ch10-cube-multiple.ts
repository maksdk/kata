import $ from 'jquery';
import { Ch10Shaders } from '../common/shaders';
import { ShapeData } from '../common/shape-data';
import { Transforms as T3D } from '../common/transforms';
import { Ch10 } from './ch10-texture';

export class MyShape{
    public static CreateShape(){
        Ch10Shaders.shininess = $('#id-shininess').val()?.toString() as string;

        T3D.CameraPosition = [2,2,3];
        const data = ShapeData.CubeData();
        Ch10.vertexData = data.vertices;
        Ch10.normalData = data.normals;
        Ch10.uvData = data.uv1;        
        Ch10.CreateShape();
    }
}

Ch10.textureFile = 'multiple.png';
MyShape.CreateShape();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') Ch10.isAnimation = true;
    else Ch10.isAnimation = false;
    MyShape.CreateShape();
});

$('#btn-redraw').on('click', function(){
    MyShape.CreateShape();
});

