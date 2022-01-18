import $ from 'jquery';
import { Ch10Shaders } from '../common/shaders';
import { Surfaces } from '../common/surfaces';
import { MathFunc } from '../common/math-func'
import { Textures } from '../common/textures';
import { Ch10 } from './ch10-texture';

export class MyShape{
    public static CreateShape(){
        Textures.uLength = parseFloat($('#id-ulength').val()?.toString() as string);
        Textures.vLength = parseFloat($('#id-vlength').val()?.toString() as string);
        Ch10Shaders.shininess = $('#id-shininess').val()?.toString() as string;

        const data = Surfaces.ParametricSurfaceData(MathFunc.KleinBottle, 0,Math.PI,0,2*Math.PI,70,30,-2,2,-2,3,-2,2,1.5);
        Ch10.vertexData = data?.vertexData as Float32Array;
        Ch10.normalData = data?.normalData as Float32Array;
        Ch10.uvData = data?.uvData as Float32Array;
        Ch10.CreateShape();
    }
}

Ch10Shaders.shininess = '100.0';
MyShape.CreateShape();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') Ch10.isAnimation = true;
    else Ch10.isAnimation = false;
    MyShape.CreateShape();
});

$('#id-select').on('change',function(){
    const ele = this as any;
    Ch10.textureFile = ele.options[ele.selectedIndex].value + '.png';
    MyShape.CreateShape();
});

$('#id-addressu').on('change',function(){
    const ele = this as any;
    Textures.addressModeU = ele.options[ele.selectedIndex].value;
    MyShape.CreateShape();
});

$('#id-addressv').on('change',function(){
    const ele = this as any;
    Textures.addressModeV = ele.options[ele.selectedIndex].value;
    MyShape.CreateShape();
});

$('#btn-redraw').on('click', function(){
    MyShape.CreateShape();
});
