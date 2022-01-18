import { vec3 } from 'gl-matrix';
import { MathFunc } from './math-func';
import { Textures } from './textures'

export class ShapeData {
    public static TorusData(R:number,r:number, N:number, n:number, center:vec3 = [0,0,0]){
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

        let vertex = [] as any, normal = [] as any;
        let p0,p1,p2,p3;
        let ca:vec3, db:vec3, cp:vec3;
        for(let i=0;i<N-1;i++){
            for(let j=0;j<n-1;j++){
                p0 = pts[i][j];
                p1 = pts[i+1][j];
                p2 = pts[i+1][j+1];
                p3 = pts[i][j+1];

                //vertex data
                vertex.push([
                    p0[0],p0[1],p0[2],p1[0],p1[1],p1[2],p2[0],p2[1],p2[2],
                    p2[0],p2[1],p2[2],p3[0],p3[1],p3[2],p0[0],p0[1],p0[2]
                ]);

                //normal data
                ca = vec3.subtract(vec3.create(), p2, p0);
                db = vec3.subtract(vec3.create(), p3, p1);
                cp = vec3.cross(vec3.create(), ca, db);
                vec3.normalize(cp,cp);
                normal.push([
                    cp[0],cp[1],cp[2],cp[0],cp[1],cp[2],cp[0],cp[1],cp[2],
                    cp[0],cp[1],cp[2],cp[0],cp[1],cp[2],cp[0],cp[1],cp[2]
                ]);
            }
        }
        return {
            vertexData: new Float32Array(vertex.flat()), 
            normalData: new Float32Array(normal.flat())
        };
    }

    public static CylinderData(rin:number,rout:number, height:number, n:number, center:vec3 = [0,0,0]){
        if(n<2 || rin>=rout) return;
        let pts = [] as any, h = height/2;

        for(let i = 0;i<n;i++){
            pts.push([
                 MathFunc.CylinderPosition(rout,i*360/(n-1), h, center),
                 MathFunc.CylinderPosition(rout,i*360/(n-1), -h, center),
                 MathFunc.CylinderPosition(rin,i*360/(n-1), -h, center),
                 MathFunc.CylinderPosition(rin,i*360/(n-1), h, center)]);
         }
 
        let vertex = [] as any, normal = [] as any, p = [] as any, uv = [] as any;
        let u0:number, u1:number, u2:number, u3:number, u4:number,u5:number, u6:number, u7:number;
        for(let i=0;i<n-1;i++){
            p[0] = pts[i][0];
            p[1] = pts[i][1];
            p[2] = pts[i][2];
            p[3] = pts[i][3];
            p[4] = pts[i+1][0];
            p[5] = pts[i+1][1];
            p[6] = pts[i+1][2];
            p[7] = pts[i+1][3];

            //vertex data
            vertex.push([               
               //top face
               p[0][0],p[0][1],p[0][2],p[4][0],p[4][1],p[4][2],p[7][0],p[7][1],p[7][2],
               p[7][0],p[7][1],p[7][2],p[3][0],p[3][1],p[3][2],p[0][0],p[0][1],p[0][2],

               //bottom face
               p[1][0],p[1][1],p[1][2],p[2][0],p[2][1],p[2][2],p[6][0],p[6][1],p[6][2],
               p[6][0],p[6][1],p[6][2],p[5][0],p[5][1],p[5][2],p[1][0],p[1][1],p[1][2],

               //outer face
               p[0][0],p[0][1],p[0][2],p[1][0],p[1][1],p[1][2],p[5][0],p[5][1],p[5][2],
               p[5][0],p[5][1],p[5][2],p[4][0],p[4][1],p[4][2],p[0][0],p[0][1],p[0][2],

               //inner face
               p[2][0],p[2][1],p[2][2],p[3][0],p[3][1],p[3][2],p[7][0],p[7][1],p[7][2],
               p[7][0],p[7][1],p[7][2],p[6][0],p[6][1],p[6][2],p[2][0],p[2][1],p[2][2]
            ]);

            //normal data
            normal.push([               
                //top face
                0,1,0,0,1,0,0,1,0,
                0,1,0,0,1,0,0,1,0,
 
                //bottom face
                0,-1,0,0,-1,0,0,-1,0,
                0,-1,0,0,-1,0,0,-1,0,
 
                //outer face
                p[0][0]/rout,0,p[0][2]/rout,p[1][0]/rout,0,p[1][2]/rout,p[5][0]/rout,0,p[5][2]/rout,
                p[5][0]/rout,0,p[5][2]/rout,p[4][0]/rout,0,p[4][2]/rout,p[0][0]/rout,0,p[0][2]/rout,
 
                //inner face
                p[3][0]/rin,0,p[3][2]/rin,p[7][0]/rin,0,p[7][2]/rin,p[6][0]/rin,0,p[6][2]/rin,
                p[6][0]/rin,0,p[6][2]/rin,p[2][0]/rin,0,p[2][2]/rin,p[3][0]/rin,0,p[3][2]/rin
             ]);

             //uv data
            u0 = Textures.uLength * (0.5 + Math.atan2(p[0][0]/rout, p[0][2]/rout)/Math.PI/2);
            u1 = Textures.uLength * (0.5 + Math.atan2(p[1][0]/rout, p[1][2]/rout)/Math.PI/2);
            u2 = Textures.uLength * (0.5 + Math.atan2(p[2][0]/rin, p[2][2]/rin)/Math.PI/2);
            u3 = Textures.uLength * (0.5 + Math.atan2(p[3][0]/rin, p[3][2]/rin)/Math.PI/2);
            u4 = Textures.uLength * (0.5 + Math.atan2(p[4][0]/rout, p[4][2]/rout)/Math.PI/2);
            u5 = Textures.uLength * (0.5 + Math.atan2(p[5][0]/rout, p[5][2]/rout)/Math.PI/2);
            u6 = Textures.uLength * (0.5 + Math.atan2(p[6][0]/rin, p[6][2]/rin)/Math.PI/2);
            u7 = Textures.uLength * (0.5 + Math.atan2(p[7][0]/rin, p[7][2]/rin)/Math.PI/2);
            let vv = Textures.vLength;

            uv.push([
                //top face
                u0, vv, u4, vv, u7, 0,
                u7, 0,  u3, 0,  u0, 1,
                                
                //bottom face
                u1, vv, u2, 0,  u6, 0,
                u6, 0,  u5, vv, u1, vv,
               
                //outer face
                u0, vv, u1, 0,  u5, 0,
                u5, 0,  u4, vv, u0, vv,

                //inner face
                u2, 0,  u3, vv, u7, vv,
                u7, vv, u6, 0,  u2, 0
            ]);

        }        

        return {
            vertexData: new Float32Array(vertex.flat()), 
            normalData: new Float32Array(normal.flat()),
            uvData: new Float32Array(uv.flat())
        };
    }

    public static ConeData(rtop:number, rbottom:number, height:number, n:number, center:vec3 = [0,0,0]){
        if(n<2) return;
        let pts = [] as any, h = height/2;

        for(let i = 0;i<n+1;i++){
            pts.push([
                 MathFunc.ConePosition(rtop,i*360/(n-1), h, center),
                 MathFunc.ConePosition(rbottom,i*360/(n-1), -h, center),
                 MathFunc.ConePosition(0,i*360/(n-1), -h, center),
                 MathFunc.ConePosition(0,i*360/(n-1), h, center)]);
         }
 
        let vertex = [] as any, normal = [] as any, p = [] as any;
        let ca:vec3, db:vec3, cp:vec3;
        for(let i=0;i<n-1;i++){
            p[0] = pts[i][0];
            p[1] = pts[i][1];
            p[2] = pts[i][2];
            p[3] = pts[i][3];
            p[4] = pts[i+1][0];
            p[5] = pts[i+1][1];
          
            //vertex data
            vertex.push([
                //top face
                p[0][0],p[0][1],p[0][2],p[4][0],p[4][1],p[4][2],p[3][0],p[3][1],p[3][2],
                
                //bottom face
                p[1][0],p[1][1],p[1][2],p[2][0],p[2][1],p[2][2],p[5][0],p[5][1],p[5][2],
               
                //outer face
                p[0][0],p[0][1],p[0][2],p[1][0],p[1][1],p[1][2],p[5][0],p[5][1],p[5][2],
                p[5][0],p[5][1],p[5][2],p[4][0],p[4][1],p[4][2],p[0][0],p[0][1],p[0][2],
            ]);

            //normal data
            ca = vec3.subtract(vec3.create(),p[5],p[0]);
            db = vec3.subtract(vec3.create(),p[4],p[1]);
            cp = vec3.cross(vec3.create(), ca, db);
            vec3.normalize(cp,cp);

            normal.push([
                //top face
                0,1,0,0,1,0,0,1,0,

                //bottom face
                0,-1,0,0,-1,0,0,-1,0,

                //outer face
                cp[0],cp[1],cp[2],cp[0],cp[1],cp[2],cp[0],cp[1],cp[2],
                cp[0],cp[1],cp[2],cp[0],cp[1],cp[2],cp[0],cp[1],cp[2]
            ])
        }        

        return { vertexData: new Float32Array(vertex.flat()), normalData: new Float32Array(normal.flat())}
    }

    public static SphereData(radius:number,u:number, v:number, center:vec3 = [0,0,0]){
        if(u<2 || v<2) return;
        let pts = [];
        let pt:vec3;
        for(let i = 0;i<u;i++){
            let pt1:vec3[] = [];
            for(let j=0;j<v;j++){
                pt = MathFunc.SpherePosition(radius, i*180/(u-1), j*360/(v-1), center);                
                pt1.push(pt);
            }
            pts.push(pt1);
        }

        let vertex = [] as any, normal = [] as any, uv = [] as any;
        let p0:vec3,p1:vec3,p2:vec3,p3:vec3,a:vec3, b:vec3;
        let u0, u1, u2,u3, v0,v1,v2,v3;
        for(let i=0;i<u-1;i++){
            for(let j=0;j<v-1;j++){
                p0 = pts[i][j];
                p1 = pts[i+1][j];
                p2 = pts[i+1][j+1];
                p3 = pts[i][j+1];
                a = vec3.create();
                b = vec3.create();
                vec3.subtract(a, p2,p0);
                vec3.subtract(b, p1,p3); 
                
                // vertex data
                vertex.push([
                    //first triangle                    
                    p0[0],p0[1],p0[2], p1[0],p1[1],p1[2], p3[0],p3[1],p3[2],  

                    //second triangle                    
                    p1[0],p1[1],p1[2], p2[0],p2[1],p2[2], p3[0],p3[1],p3[2]  
                ]);

                //normal data
                normal.push([
                    //first triangle
                    p0[0]/radius,p0[1]/radius,p0[2]/radius,
                    p1[0]/radius,p1[1]/radius,p1[2]/radius,
                    p3[0]/radius,p3[1]/radius,p3[2]/radius,

                    //second triangle                    
                    p1[0]/radius,p1[1]/radius,p1[2]/radius, 
                    p2[0]/radius,p2[1]/radius,p2[2]/radius,
                    p3[0]/radius,p3[1]/radius,p3[2]/radius
                ]);

                //uv data
                u0 = Textures.uLength * (0.5+Math.atan2(p0[0]/radius,p0[2]/radius)/Math.PI/2);
                u1 = Textures.uLength * (0.5+Math.atan2(p1[0]/radius,p1[2]/radius)/Math.PI/2);
                u2 = Textures.uLength * (0.5+Math.atan2(p2[0]/radius,p2[2]/radius)/Math.PI/2);
                u3 = Textures.uLength * (0.5+Math.atan2(p3[0]/radius,p3[2]/radius)/Math.PI/2);
                v0 = Textures.vLength * (0.5-Math.asin(p0[1]/radius)/Math.PI);
                v1 = Textures.vLength * (0.5-Math.asin(p1[1]/radius)/Math.PI);
                v2 = Textures.vLength * (0.5-Math.asin(p2[1]/radius)/Math.PI);
                v3 = Textures.vLength * (0.5-Math.asin(p3[1]/radius)/Math.PI);

                uv.push([
                    //first triangle
                    u0, v0, u1, v1, u3, v2,                   

                    //second triangle 
                    u1, v1, u2, v2, u3, v3                   
                ]);

            }
        }
        return {
            vertexData: new Float32Array(vertex.flat()),
            normalData: new Float32Array(normal.flat()),
            uvData: new Float32Array(uv.flat())
        }
    }

    public static CubeData1(){
        return new Float32Array([
            //position,  color,     uv,
            //front
            1,  1,  1,   1, 1, 1,   1, 1,
           -1,  1,  1,   0, 1, 1,   0, 1,
           -1, -1,  1,   0, 0, 1,   0, 0,
           -1, -1,  1,   0, 0, 1,   0, 0,
            1, -1,  1,   1, 0, 1,   1, 0,
            1,  1,  1,   1, 1, 1,   1, 1,
          
            //right
            1,  1,  1,   1, 1, 1,   1, 1,
            1, -1,  1,   1, 0, 1,   0, 1,
            1, -1, -1,   1, 0, 0,   0, 0,
            1,  1, -1,   1, 1, 0,   1, 0,
            1,  1,  1,   1, 1, 1,   1, 1,
            1, -1, -1,   1, 0, 0,   0, 0,

            //back
            1, -1, -1,   1, 0, 0,   1, 1,
           -1, -1, -1,   0, 0, 0,   0, 1,
           -1,  1, -1,   0, 1, 0,   0, 0,
            1,  1, -1,   1, 1, 0,   1, 0,
            1, -1, -1,   1, 0, 0,   1, 1,
           -1,  1, -1,   0, 1, 0,   0, 0,

            //left
           -1, -1,  1,   0, 0, 1,   1, 1,
           -1,  1,  1,   0, 1, 1,   0, 1,
           -1,  1, -1,   0, 1, 0,   0, 0,
           -1, -1, -1,   0, 0, 0,   1, 0,
           -1, -1,  1,   0, 0, 1,   1, 1,
           -1,  1, -1,   0, 1, 0,   0, 0,
          
            //top
           -1,  1,  1,   0, 1, 1,   1, 1,
            1,  1,  1,   1, 1, 1,   0, 1,
            1,  1, -1,   1, 1, 0,   0, 0,
           -1,  1, -1,   0, 1, 0,   1, 0,
           -1,  1,  1,   0, 1, 1,   1, 1,
            1,  1, -1,   1, 1, 0,   0, 0,         
           
            //bottom
            1, -1,  1,   1, 0, 1,   1, 1,
           -1, -1,  1,   0, 0, 1,   0, 1,
           -1, -1, -1,   0, 0, 0,   0, 0,
            1, -1, -1,   1, 0, 0,   1, 0,
            1, -1,  1,   1, 0, 1,   1, 1,
           -1, -1, -1,   0, 0, 0,   0, 0
        ]);
    }

    public static CubeData(uLength = 1, vLength = 1){
        const vertices = new Float32Array([
            //front
            -1, -1,  1,   1, -1,  1,  -1,  1,  1,  -1,  1,  1,   1, -1, 1,     1,  1,  1,

            //right
             1, -1,  1,   1, -1, -1,   1,  1,  1,   1,  1,  1,   1, -1, -1,    1,  1, -1,

            //back
             1, -1, -1,  -1, -1, -1,   1,  1, -1,   1,  1, -1,  -1, -1, -1,   -1,  1, -1,

            //left 
            -1, -1, -1,  -1, -1,  1,  -1,  1, -1,  -1,  1, -1,  -1, -1,  1,   -1,  1,  1,

            //top
            -1,  1,  1,   1,  1,  1,  -1,  1, -1,  -1,  1, -1,   1,  1,  1,    1,  1, -1,

            //bottom
            -1, -1, -1,   1, -1, -1,  -1, -1,  1,  -1, -1,  1,   1, -1, -1,    1, -1,  1
        ]);

        const colors = new Float32Array([
            // front - blue
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

            // right - red
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

            // back - yellow           
            1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,

            // left - aqua
            0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1,

            // top - green
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

            // bottom - fuchsia
            1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1
       ]);
       
        const normals = new Float32Array([
            // front - blue
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

            // right - red
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

            // back - yellow           
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

            // left - aqua
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,

            // top - green
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

            // bottom - fuchsia
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0
        ]);

       const ul = uLength;
       const vl = vLength;
       const uvs = new Float32Array([
            //front
            0, 0, ul, 0, 0, vl, 0, vl, ul, 0, ul, vl,

            //right
            0, 0, ul, 0, 0, vl, 0, vl, ul, 0, ul, vl,

            //back
            0, 0, ul, 0, 0, vl, 0, vl, ul, 0, ul, vl,

            //left
            0, 0, ul, 0, 0, vl, 0, vl, ul, 0, ul, vl,

            //top
            0, 0, ul, 0, 0, vl, 0, vl, ul, 0, ul, vl,

            //bottom
            0, 0, ul, 0, 0, vl, 0, vl, ul, 0, ul, vl,
       ]);


       const uv1 = new Float32Array([
            //front
            0, 1/2, 1/3, 1/2, 0, 1,       0, 1, 1/3, 1/2, 1/3, 1,

            //right
            1/3, 1/2, 2/3, 1/2, 1/3, 1,   1/3, 1, 2/3, 1/2, 2/3, 1,

            //back
            2/3, 1/2, 1, 1/2, 2/3, 1,     2/3, 1, 1, 1/2, 1, 1,

            //left
            0, 0, 0, 1/2, 1/3, 0,         1/3, 0, 0, 1/2, 1/3, 1/2,

            //top
            1/3, 0, 2/3, 0, 1/3, 1/2,     1/3, 1/2, 2/3, 0, 2/3, 1/2,

            //bottom
            2/3, 1/2, 1, 1/2, 2/3, 0,     2/3, 0, 1, 1/2, 1, 0,
       ]);

        return {
            vertices,
            colors,
            normals,
            uvs,
            uv1
        };
    }
}