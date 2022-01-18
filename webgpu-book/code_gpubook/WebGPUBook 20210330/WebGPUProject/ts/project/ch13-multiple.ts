import $ from 'jquery';
import { Colormaps } from '../common/colormaps';
import { Surfaces } from '../common/surfaces';
import { MathFunc } from '../common/math-func'
import { Ch09 } from './ch09-surface';
import { ShapeData } from '../common/shape-data';

export class Ch13Multiple{
    //public static vnData:any;

    public static CreateShapes(){
        //create sinc surface
        let vnData = Surfaces.SimpleSurfaceData(MathFunc.Sinc, -8, 8, -1, 1, -8, 8, 30, 30, 1.2,[-10,-1,0]);     
        const sincVertex = vnData?.vertexData as Float32Array;
        const sincColor = Colormaps.CreateColorData(sincVertex, 'jet', 'y');
        const sincNormal = vnData?.normalData as Float32Array;

        //create peaks surface
        vnData = Surfaces.SimpleSurfaceData(MathFunc.Peaks, -3, 3, -7, 8, -3, 3, 31, 31, 1.2,[6,-1,0]);
        const peakVertex = vnData?.vertexData as Float32Array;
        const peakColor = Colormaps.CreateColorData(peakVertex, 'cool', 'y');
        const peakNormal = vnData?.normalData as Float32Array;
        
        //create sphere
        vnData = Surfaces.ParametricSurfaceData(MathFunc.Sphere, 0,2*Math.PI,-Math.PI/2,Math.PI/2,20,15,-1,1,-1,1,-1,1,1,[0,1,0]);
        const sphereVertex = vnData?.vertexData as Float32Array;
        const sphereColor = Colormaps.CreateColorData(sphereVertex, 'hsv', 'y');
        const sphereNormal = vnData?.normalData as Float32Array;

        //create cylinder
        const cData = ShapeData.CylinderData(0.3, 0.7, 1.5, 20, [1,-2,0]);
        const cylinderVertex = cData?.vertexData as Float32Array;
        const cylinderColor = Colormaps.CreateColorData(cylinderVertex, 'hsv', 'x');
        const cylinderNormal = cData?.normalData as Float32Array

        let vertexData = MathFunc.Float32ArrayConcat(sincVertex, peakVertex);
        let colorData = MathFunc.Float32ArrayConcat(sincColor, peakColor);
        let normalData = MathFunc.Float32ArrayConcat(sincNormal, peakNormal);
        
        vertexData = MathFunc.Float32ArrayConcat(vertexData, sphereVertex);
        colorData = MathFunc.Float32ArrayConcat(colorData, sphereColor);
        normalData = MathFunc.Float32ArrayConcat(normalData, sphereNormal);

        vertexData = MathFunc.Float32ArrayConcat(vertexData, cylinderVertex);
        colorData = MathFunc.Float32ArrayConcat(colorData, cylinderColor);
        normalData = MathFunc.Float32ArrayConcat(normalData, cylinderNormal);
        
        Ch09.vertexData = vertexData;
        Ch09.colorData  = colorData;
        Ch09.normalData = normalData;
        Ch09.CreateSurface();
    }
}

Ch13Multiple.CreateShapes();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') Ch09.isAnimation = true;
    else Ch09.isAnimation = false;
    Ch13Multiple.CreateShapes();
});
