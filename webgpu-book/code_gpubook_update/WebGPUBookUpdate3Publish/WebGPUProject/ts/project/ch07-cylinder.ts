import { vec3 } from 'gl-matrix';
import $ from 'jquery';
import { MathFunc } from '../common/math-func'
import { Ch07Wireframe } from './ch07-wireframe'

export class Ch07 {
    public static rin = 0.5;
    public static rout = 1.5;
    public static height = 3;
    public static n = 20;

    private static CylinderMeshData(rin:number,rout:number, height:number, n:number, center:vec3 =[0,0,0]){
        if(n<2 || rin>=rout) return;
        let pts = [] as any, h = height/2;
        
        for(let i = 0;i<n;i++){
           pts.push([
                MathFunc.CylinderPosition(rout,i*360/(n-1), h, center),
                MathFunc.CylinderPosition(rout,i*360/(n-1), -h, center),
                MathFunc.CylinderPosition(rin,i*360/(n-1), -h, center),
                MathFunc.CylinderPosition(rin,i*360/(n-1), h, center)]);
        }

        let pp = [] as any, p = [] as any;
        for(let i=0;i<n-1;i++){
            p[0] = pts[i][0];
            p[1] = pts[i][1];
            p[2] = pts[i][2];
            p[3] = pts[i][3];
            p[4] = pts[i+1][0];
            p[5] = pts[i+1][1];
            p[6] = pts[i+1][2];
            p[7] = pts[i+1][3];

            pp.push([
                //top face – 3 lines
                p[0][0],p[0][1],p[0][2],p[3][0],p[3][1],p[3][2],
                p[3][0],p[3][1],p[3][2],p[7][0],p[7][1],p[7][2],
                p[4][0],p[4][1],p[4][2],p[0][0],p[0][1],p[0][2],

                //bottom face – 3 lines
                p[1][0],p[1][1],p[1][2],p[2][0],p[2][1],p[2][2],
                p[2][0],p[2][1],p[2][2],p[6][0],p[6][1],p[6][2],
                p[5][0],p[5][1],p[5][2],p[1][0],p[1][1],p[1][2],

                //side – 2 lines
                p[0][0],p[0][1],p[0][2],p[1][0],p[1][1],p[1][2],
                p[3][0],p[3][1],p[3][2],p[2][0],p[2][1],p[2][2]
            ]);
        }        

        return new Float32Array(pp.flat());
    }

        
    static async CreateShape() {
        const meshData = this.CylinderMeshData(this.rin, this.rout, this.height, this.n, Ch07Wireframe.centerLocation) as Float32Array;
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
    Ch07.rin = parseFloat($('#id-rin').val()?.toString() as string);
    Ch07.rout = parseFloat($('#id-rout').val()?.toString() as string);
    Ch07.height = parseFloat($('#id-height').val()?.toString() as string);
    Ch07.n = parseInt($('#id-n').val()?.toString() as string);
    Ch07Wireframe.CreateWireframe(); 
    Ch07.CreateShape();   
});
