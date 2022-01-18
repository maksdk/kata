import { vec3 } from 'gl-matrix';
import $ from 'jquery';
import { MathFunc } from '../common/math-func'
import { Ch07Wireframe } from './ch07-wireframe'

export class Ch07 {
    public static rlarge = 2;
    public static rsmall = 0.5;
    public static nlarge = 30;
    public static nsmall = 15;

    private static TorusMeshData (R:number,r:number, N:number, n:number, center:vec3 = [0,0,0]){
        if(n<2 || N<2) return;
        let pts = [];
        let pt:vec3;
        for(let i = 0;i<N;i++){
            let pt1:vec3[] = [];
            for(let j=0;j<n;j++){
                pt = MathFunc.TorusPosition(R, r, i*360/(N-1),j*360/(n-1), center);               
                pt1.push(pt);
            }
            pts.push(pt1);
        }

        let pp = [] as any;
        let p0,p1,p2,p3;
        for(let i=0;i<N-1;i++){
            for(let j=0;j<n-1;j++){
                p0 = pts[i][j];
                p1 = pts[i+1][j];
                p2 = pts[i+1][j+1];
                p3 = pts[i][j+1];
                pp.push([
                    p0[0],p0[1],p0[2],p1[0],p1[1],p1[2],                   
                    p3[0],p3[1],p3[2],p0[0],p0[1],p0[2]
                ]);
            }
        }

        return new Float32Array(pp.flat());
    }
        
    static async CreateShape() {
        const meshData = this.TorusMeshData(this.rlarge,this.rsmall, this.nlarge,this.nsmall, Ch07Wireframe.centerLocation) as Float32Array;
        Ch07Wireframe.meshData = meshData;        
        await Ch07Wireframe.CreateWireframe();
    } 
}

Ch07.CreateShape();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') Ch07Wireframe.isAnimation = true;
    else Ch07Wireframe.isAnimation = false;
    Ch07.CreateShape();
});

$('#btn-redraw').on('click', function(){
    const val = $('#id-center').val();
    Ch07Wireframe.centerLocation = val?.toString().split(',').map(Number) as vec3;
    Ch07.rlarge = parseFloat($('#id-rlarge').val()?.toString() as string);
    Ch07.rsmall = parseFloat($('#id-rsmall').val()?.toString() as string);
    Ch07.nlarge = parseInt($('#id-nlarge').val()?.toString() as string);
    Ch07.nsmall = parseInt($('#id-nsmall').val()?.toString() as string);
    Ch07.CreateShape();   
});
