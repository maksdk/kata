import { vec3 } from 'gl-matrix';
import $ from 'jquery';
import { Ch07Wireframe } from './ch07-wireframe'

export class Ch07 {
    private static CubeMeshData(center: vec3){
        let pp=[] as any, p=[] as any;
        p[0]=[-1,1,1];
        p[1]=[-1,1,-1];
        p[2]=[1,1,-1];
        p[3]=[1,1,1];
        p[4]=[-1,-1,1];
        p[5]=[-1,-1,-1];
        p[6]=[1,-1,-1];
        p[7]=[1,-1,1];

        for(let i=0;i<8;i++){
            p[i][0]+=center[0];
            p[i][1]+=center[1];
            p[i][2]+=center[2];
        }

        pp.push([
            //top face:
            p[0][0],p[0][1],p[0][2],p[1][0],p[1][1],p[1][2],
            p[1][0],p[1][1],p[1][2],p[2][0],p[2][1],p[2][2],
            p[2][0],p[2][1],p[2][2],p[3][0],p[3][1],p[3][2],
            p[3][0],p[3][1],p[3][2],p[0][0],p[0][1],p[0][2],

            //bottom face:
            p[4][0],p[4][1],p[4][2],p[5][0],p[5][1],p[5][2],
            p[5][0],p[5][1],p[5][2],p[6][0],p[6][1],p[6][2],
            p[6][0],p[6][1],p[6][2],p[7][0],p[7][1],p[7][2],
            p[7][0],p[7][1],p[7][2],p[4][0],p[4][1],p[4][2],

            //side 4 lines:
            p[0][0],p[0][1],p[0][2],p[4][0],p[4][1],p[4][2],
            p[1][0],p[1][1],p[1][2],p[5][0],p[5][1],p[5][2],
            p[2][0],p[2][1],p[2][2],p[6][0],p[6][1],p[6][2],
            p[3][0],p[3][1],p[3][2],p[7][0],p[7][1],p[7][2]
        ]);
    
        return new Float32Array(pp.flat());
    }

    static async CreateShape() {
        const meshData = this.CubeMeshData(Ch07Wireframe.centerLocation);
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
    Ch07.CreateShape();
});
