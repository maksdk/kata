import $ from 'jquery';
import { Ch09 } from './ch09-surface';
import { ComplexFunc } from '../common/complex-func';

export class MySurface{
    public static vnData:any;
    public static chartType = 'magnitude';

    public static CreateShape(){
        const fz = $('#id-zfunc').val()?.toString() as string;
        const params = $('#id-param').val()?.toString().split(',').map(Number) as number[];
        const xzrange = $('#id-xzrange').val()?.toString().split(',').map(Number) as number[];
        const xzpoints = $('#id-xzpoints').val()?.toString().split(',').map(Number) as number[];
        const scaling = $('#id-scale').val()?.toString().split(',').map(Number) as number[];

        this.vnData = ComplexFunc.ComplexSurfaceData(fz, this.chartType, xzrange[0],xzrange[1],xzrange[2], xzrange[3],
            xzpoints[0],xzpoints[1], scaling,Ch09.colormapName,params[0],params[1],params[2], params[3]);
        Ch09.vertexData = this.vnData?.vertexData as Float32Array;
        Ch09.normalData = this.vnData?.normalData as Float32Array;
        Ch09.colorData = this.vnData?.colorData as Float32Array;
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

$('#id-charttype').on('change',function(){
    const ele = this as any;
    MySurface.chartType = ele.options[ele.selectedIndex].text;
    MySurface.CreateShape();
});

$('#id-select').on('change',function(){
    const ele = this as any;
    Ch09.colormapName = ele.options[ele.selectedIndex].text;
    MySurface.CreateShape();
});

$('#btn-redraw').on('click', function(){
    MySurface.CreateShape();
});