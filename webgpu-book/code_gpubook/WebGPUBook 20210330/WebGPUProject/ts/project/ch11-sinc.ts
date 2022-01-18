import $ from 'jquery';
import { Surfaces } from '../common/surfaces';
import { MathFunc } from '../common/math-func'
import { Colormaps } from '../common/colormaps';
import { Ch11 } from './ch11-chart';

export class MyShape{
    public static CreateChart(){
        const data = Surfaces.SimpleSurfaceData(MathFunc.Sinc, -8, 8, -1, 1, -8, 8, 30, 30, 2);
        Ch11.vertexData = data?.vertexData as Float32Array;
        Ch11.normalData = data?.normalData as Float32Array;
        Ch11.uvData = data?.uv1Data as Float32Array;
        Ch11.colorData  = Colormaps.CreateColorData(data?.vertexData as Float32Array, Ch11.colormapName, 'y');
        Ch11.CreateShape();
    }
}

MyShape.CreateChart();
Ch11.CreateShape();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') Ch11.isAnimation = true;
    else Ch11.isAnimation = false;
    MyShape.CreateChart();
});

$('#id-texture').on('change',function(){
    const ele = this as any;
    Ch11.textureFile = ele.options[ele.selectedIndex].value + '.png';
    MyShape.CreateChart();
});

$('#id-colormap').on('change',function(){
    const ele = this as any;
    Ch11.colormapName = ele.options[ele.selectedIndex].text;
    MyShape.CreateChart();
});

