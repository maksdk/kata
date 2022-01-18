import { vec3 } from 'gl-matrix';
import $ from 'jquery';
import { MathFunc } from '../common/math-func'
import { Ch07Wireframe } from './ch07-wireframe'

export class Ch07 {
    public static rtop = 0.5;
    public static rbottom = 2;
    public static height = 3;
    public static n = 20;

    private static ConeMeshData(rtop:number, rbottom:number, height:number, n:number, center:vec3 = [0,0,0]){
        if(n<2) return;
        let pts = [] as any, h = height/2;

        for(let i = 0;i<n+1;i++){
            pts.push([
                MathFunc.ConePosition(rtop,i*360/(n-1), h, center),
                MathFunc.ConePosition(rbottom,i*360/(n-1), -h, center),
                MathFunc.ConePosition(0,i*360/(n-1), -h, center),
                MathFunc.ConePosition(0,i*360/(n-1), h, center)]);
         }
 
        let pp = [] as any, p = [] as any;
        for(let i=0;i<n-1;i++){
            p[0] = pts[i][0];
            p[1] = pts[i][1];
            p[2] = pts[i][2];
            p[3] = pts[i][3];
            p[4] = pts[i+1][0];
            p[5] = pts[i+1][1];

            pp.push([
                //top 
                p[0][0],p[0][1],p[0][2],p[3][0],p[3][1],p[3][2],
                p[4][0],p[4][1],p[4][2],p[0][0],p[0][1],p[0][2],

                //bottom 
                p[1][0],p[1][1],p[1][2],p[2][0],p[2][1],p[2][2],
                p[5][0],p[5][1],p[5][2],p[1][0],p[1][1],p[1][2],

                //side 
                p[0][0],p[0][1],p[0][2],p[1][0],p[1][1],p[1][2]
            ]);
        }        

        return new Float32Array(pp.flat());
    }

        
    static async CreateShape() {
        const meshData = this.ConeMeshData(this.rtop,this.rbottom, this.height,this.n, Ch07Wireframe.centerLocation) as Float32Array;
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
    Ch07.rtop = parseFloat($('#id-rtop').val()?.toString() as string);
    Ch07.rbottom = parseFloat($('#id-rbottom').val()?.toString() as string);
    Ch07.height = parseFloat($('#id-height').val()?.toString() as string);
    Ch07.n = parseInt($('#id-n').val()?.toString() as string);
    Ch07.CreateShape();   
});
