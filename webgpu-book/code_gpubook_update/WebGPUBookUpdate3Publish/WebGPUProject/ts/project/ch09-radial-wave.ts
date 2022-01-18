import $ from 'jquery';
import { Colormaps } from '../common/colormaps';
import { Surfaces } from '../common/surfaces';
import { MathFunc } from '../common/math-func'
import {Ch09Shaders} from '../common/shaders';
import { Ch09 } from './ch09-surface';

export class MySurface{
    public static vnData:any;

    public static CreateShape(){
        this.vnData = Surfaces.ParametricSurfaceData(MathFunc.RadialWave, 0,2*Math.PI,0,4*Math.PI,70,70,-1,1,-8,8,-1,1,2);        
        Ch09.colorData  = Colormaps.CreateColorData(this.vnData?.vertexData as Float32Array, Ch09.colormapName, Ch09.colormapDirection);
        Ch09.vertexData = this.vnData?.vertexData as Float32Array;
        Ch09.normalData = this.vnData?.normalData as Float32Array;
        Ch09.CreateSurface();
    }
}

MySurface.CreateShape();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') Ch09.isAnimation = true;
    else Ch09.isAnimation = false;
    MySurface.CreateShape();
});

$('#id-select').on('change',function(){
    const ele = this as any;
    Ch09.colormapName = ele.options[ele.selectedIndex].text;
    MySurface.CreateShape();
});

$('#btn-redraw').on('click', function(){

    Ch09Shaders.isPhong = $('#id-isphong').val()?.toString() as string;
    Ch09Shaders.isTwoSideLighting = $('#id-twoside').val()?.toString() as string;
    Ch09.colormapDirection = $('#id-direction').val()?.toString() as string;
    MySurface.CreateShape();
});