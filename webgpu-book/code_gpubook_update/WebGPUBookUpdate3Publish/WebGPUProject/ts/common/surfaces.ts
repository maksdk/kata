import { vec2, vec3 } from 'gl-matrix';
import { Textures } from './textures'

export class Surfaces {
    public static ParametricSurfaceData(f:any, umin:number, umax:number, vmin:number, vmax:number, nu:number, nv:number, 
        xmin:number, xmax:number, ymin:number, ymax:number, zmin:number, zmax:number, scaleFactor:number, center:vec3=[0,0,0]){            
        if(nu<2 || nv<2) return;
        const du = (umax-umin)/(nu-1);
        const dv = (vmax-vmin)/(nv-1);
        let pts = [] as any, puv = [] as any;
        let u:number, v:number;
        let pt:vec3, pn:vec3;
        let puvn:vec2;

        for(let i = 0; i < nu; i++){
            u = umin + i*du;
            let pt1 = [];
            let puv1 = [];
            for(let j = 0; j < nv; j++){
                v = vmin + j*dv;
                pt = f(u, v, center);
                pn = this.NormalizePoint(pt, xmin, xmax, ymin, ymax, zmin, zmax, scaleFactor);                               
                pt1.push(pn);
                puvn = this.NormalizeUVParametric(u,v, umin,umax,vmin,vmax);
                puv1.push(puvn);
            }
            pts.push(pt1);
            puv.push(puv1);
        }

        let p0:vec3, p1:vec3, p2:vec3, p3:vec3;
        let pp0:vec2, pp1:vec2, pp2:vec2, pp3:vec2;
        let vertex = [] as any, normal = [] as any, uv = [] as any, uv1 = [] as any;  
        for(let i = 0; i < nu - 1; i++){
            for(let j = 0; j < nv - 1; j++){
                p0 = pts[i][j];
                p1 = pts[i+1][j];
                p2 = pts[i+1][j+1];
                p3 = pts[i][j+1];
                let data = this.CreateQuad(p0, p1, p2, p3, scaleFactor);                            
                vertex.push(data.vertex.flat());
                normal.push(data.normal.flat());
                
                //uv data
                pp0 = puv[i][j];
                pp1 = puv[i+1][j];
                pp2 = puv[i+1][j+1];
                pp3 = puv[i][j+1];
                let uvData = this.CreateQuadUV(pp0, pp1, pp2, pp3);
                uv.push(uvData.flat());

                //uv1 data
                uv1.push(0,0, 1,0, 1,1, 1,1, 0,1, 0,0 );
            }
        }
        return{
            vertexData: new Float32Array(vertex.flat()),
            normalData: new Float32Array(normal.flat()),
            uvData: new Float32Array(uv.flat()),
            uv1Data: new Float32Array(uv1.flat())
        };
    }

    public static SimpleSurfaceData(f:any, xmin:number, xmax:number, ymin:number, ymax:number, 
        zmin:number, zmax:number, nx:number, nz:number, scaleFactor = 1, center:vec3=[0,0,0]){
        if(nx<2 || nz<2) return;
        const dx = (xmax-xmin)/(nx-1);
        const dz = (zmax-zmin)/(nz-1);
        let pts = [] as any;
        let x:number, z:number;
        let pt:vec3, pn:vec3;
        
        for(let i = 0; i < nx; i++){
            x = xmin + i*dx; 
            let pt1 = [];
            for(let j = 0; j < nz; j++){
                z = zmin + j*dz;               
                pt = f(x, z, center);                
                pn = this.NormalizePoint(pt, xmin, xmax, ymin, ymax, zmin, zmax, scaleFactor);               
                pt1.push(pn);
            }
            pts.push(pt1);
        } 

        let p0:vec3, p1:vec3, p2:vec3, p3:vec3;
        let vertex = [] as any, normal = [] as any, uv = [] as any, uv1 = [] as any;       
        for(let i = 0; i < nx - 1; i++){
            for(let j = 0; j < nz - 1; j++){
                p0 = pts[i][j];
                p1 = pts[i][j+1];
                p2 = pts[i+1][j+1];
                p3 = pts[i+1][j];
                let data = this.CreateQuad(p0, p1, p2, p3, scaleFactor);                            
                vertex.push(data.vertex.flat());
                normal.push(data.normal.flat());
                uv.push(data.uv.flat());
                uv1.push(0,0, 0,1, 1,1, 1,1, 1,0, 0,0);
            }
        }        

        return{
            vertexData: new Float32Array(vertex.flat()),
            normalData: new Float32Array(normal.flat()),
            uvData: new Float32Array(uv.flat()),
            uv1Data: new Float32Array(uv1.flat())
        };
    }

    public static SimpleMeshData (f:any, xmin:number, xmax:number, ymin:number, ymax:number, 
        zmin:number, zmax:number, nx:number, nz:number, scaleFactor = 1, center:vec3=[0,0,0]) {
        if(nx<2 || nz<2) return;
        const dx = (xmax-xmin)/(nx-1);
        const dz = (zmax-zmin)/(nz-1);
        let pts = [] as any;
        let x:number, z:number;
        let pt:vec3, pn:vec3;
        
        for(let i = 0; i < nx; i++){
            x = xmin + i*dx; 
            let pt1 = [];
            for(let j = 0; j < nz; j++){
                z = zmin + j*dz;               
                pt = f(x, z, center);                
                pn = this.NormalizePoint(pt, xmin, xmax, ymin, ymax, zmin, zmax, scaleFactor);               
                pt1.push(pn);
            }
            pts.push(pt1);
        } 

        let p0:vec3, p1:vec3, p2:vec3, p3:vec3;
        let mesh = [] as any;       
        for(let i = 0; i < nx - 1; i++){
            for(let j = 0; j < nz - 1; j++){
                p0 = pts[i][j];
                p1 = pts[i][j+1];
                p2 = pts[i+1][j+1];
                p3 = pts[i+1][j];   
                if (i!= nx-2 && j!=nz-2){
                    mesh.push([
                        p0[0],p0[1],p0[2],p1[0],p1[1],p1[2],
                        p0[0],p0[1],p0[2],p3[0],p3[1],p3[2]                        
                    ])      
                } else {                
                    mesh.push([
                        p0[0],p0[1],p0[2],p1[0],p1[1],p1[2],
                        p0[0],p0[1],p0[2],p3[0],p3[1],p3[2],
                        p1[0],p1[1],p1[2],p2[0],p2[1],p2[2],
                        p2[0],p2[1],p2[2],p3[0],p3[1],p3[2]
                    ])
               }
            }
        }        

        return new Float32Array(mesh.flat());
    }


    //#region helper
    private static NormalizePoint(pt:vec3, xmin:number, xmax:number, ymin:number, ymax:number, zmin:number, zmax:number, scaleFactor = 1){
        pt[0] = scaleFactor * (-1 + 2 * (pt[0] - xmin) / (xmax - xmin));
        pt[1] = scaleFactor * (-1 + 2 * (pt[1] - ymin) / (ymax - ymin));
        pt[2] = scaleFactor * (-1 + 2 * (pt[2] - zmin) / (zmax - zmin));
        return pt;
    }

    private static CreateQuad(p0:vec3, p1:vec3, p2:vec3, p3:vec3, scaleFactor = 1){
        let vertex = [] as any, normal = [] as any, uv = [] as any;
        let ca:vec3, db:vec3, cp:vec3;
        
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

       //uv data
       let pp0 = this.NormalizeUV(p0, scaleFactor);
       let pp1 = this.NormalizeUV(p1, scaleFactor);
       let pp2 = this.NormalizeUV(p2, scaleFactor);
       let pp3 = this.NormalizeUV(p3, scaleFactor);
       uv.push([
            pp0[0], pp0[2], pp1[0], pp1[2], pp2[0], pp2[2],
            pp2[0], pp2[2], pp3[0], pp3[2], pp0[0], pp0[2]
       ]);

       return{
           vertex,
           normal,
           uv
       }
    }

    private static CreateQuadUV(p0:vec2, p1:vec2, p2:vec2, p3:vec2){
        let uv = [] as any;
        uv.push([
            p0[0],p0[1],p1[0],p1[1],p2[0],p2[1],
            p2[0],p2[1],p3[0],p3[1],p0[0],p0[1]
        ]);
       return uv;
    }

    public static NormalizeUV(pt:vec3, scaleFactor = 1){
        let p0 = Textures.uLength * (1 + pt[0]/scaleFactor)/2;
        let p1 = (1 + pt[1]/scaleFactor)/2;
        let p2 = Textures.vLength * (1 + pt[2]/scaleFactor)/2;
        return vec3.fromValues(p0, p1, p2);
    }

    private static NormalizeUVParametric(u:number, v:number, umin:number, umax:number, vmin:number, vmax:number){
        let uu = Textures.uLength * (u - umin) / (umax - umin);
        let vv = Textures.vLength * (v - vmin) / (vmax - vmin);     
        return vec2.fromValues(uu, vv);
    }   
    //#endregion
}