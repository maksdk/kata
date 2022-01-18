import { vec3 } from 'gl-matrix';
import  { parser, arg } from 'mathjs';
import { Colormaps } from './colormaps';
const interp = require('interpolate-arrays');

export class ComplexFunc {
    public static ComplexSurfaceData(f:string, chartType: string, xmin:number, xmax:number, zmin:number, zmax:number, 
        nx:number, nz:number, scaleFactor=[1,0], colormapName='jet', a:number=0, b:number=0,c:number=0, d:number=0) {
        if(nx<2 || nz<2) return;         
        const colors = Colormaps.ColormapData(colormapName);
        if(!colors) return;

        const dx = (xmax-xmin)/(nx-1);
        const dz = (zmax-zmin)/(nz-1);
        let pchart = [] as any, pcolor = [] as any;

        let x:number, z:number;
        let pt:any, ppt:any;
        let min=0, max=0, ymin1=0, ymax1=0;
        for(let i = 0; i < nx; i++){
            x = xmin + i*dx; 
            let pt1 = [], pt2 =[];
            for(let j = 0; j < nz; j++){
                z = zmin + j*dz;               
                pt = this.CFunc(f,x,z,a,b,c,d);      
                if(chartType === 'magnitude') ppt = pt.mag;
                else if (chartType === 'phase') ppt = pt.angle;
                else if(chartType === 'real') ppt = pt.re;
                else if(chartType === 'imaginary') ppt = pt.im;
                pt1.push(ppt);
                pt2.push(pt.angle[1]);

                ymin1 =(ppt[1] < ymin1) ? ppt[1] : ymin1;
                ymax1 =(ppt[1] > ymax1) ? ppt[1] : ymax1;
                min =(pt.angle[1] < min) ? pt.angle[1] : min;
                max =(pt.angle[1] > max) ? pt.angle[1] : max;
            }
            pchart.push(pt1);
            pcolor.push(pt2);
        } 
        const ymin = ymin1 - scaleFactor[1]*(ymax1-ymin1);
        const ymax = ymax1 + scaleFactor[1]*(ymax1-ymin1);
       
        for(let i = 0; i < nx; i++){
            for(let j = 0; j < nz; j++){
                pchart[i][j] = this.NormalizePoint(pchart[i][j], xmin, xmax, ymin, ymax, zmin, zmax, scaleFactor);         
            }
        } 

        let p0:vec3, p1:vec3, p2:vec3, p3:vec3;
        let pp0, pp1, pp2, pp3;
        let vertex = [] as any, normal = [] as any, color = [] as any;       
        for(let i = 0; i < nx - 1; i++){
            for(let j = 0; j < nz - 1; j++){
                p0 = pchart[i][j];                
                p1 = pchart[i][j+1];
                p2 = pchart[i+1][j+1];
                p3 = pchart[i+1][j];
                pp0 = pcolor[i][j];
                pp1 = pcolor[i][j+1];
                pp2 = pcolor[i+1][j+1];
                pp3 = pcolor[i+1][j];
                let data = this.CreateQuad(p0, p1, p2, p3, pp0, pp1, pp2, pp3, min, max, colors);                            
                vertex.push(data.vertex.flat());
                normal.push(data.normal.flat());
                color.push(data.color.flat());
            }
        }       
        
        return{
            vertexData: new Float32Array(vertex.flat()),
            normalData: new Float32Array(normal.flat()),
            colorData: new Float32Array(color.flat())
        }
    }

    public static ComplexSurfaceData1(f:string, chartType: string, xmin:number, xmax:number, zmin:number, zmax:number, 
        nx:number, nz:number, scaleFactor=[1,0], colormapName='jet', a:number=0, b:number=0,c:number=0, d:number=0) {
        if(nx<2 || nz<2) return;         
        const colors = Colormaps.ColormapData(colormapName);
        if(!colors) return;

        const dx = (xmax-xmin)/(nx-1);
        const dz = (zmax-zmin)/(nz-1);
        let pchart = [] as any, pcolor = [] as any;

        let x:number, z:number;
        let pt:any, ppt:any;
        let min=0, max=0, ymin1=0, ymax1=0;
        
        let i=nx, j;
        while(i--){
            x = xmin + i*dx; 
            let pt1 = [], pt2 =[];
            j=nz;
            while(j--){
                z = zmin + j*dz;               
                pt = this.CFunc(f,x,z,a,b,c,d);      
                if(chartType === 'magnitude') ppt = pt.mag;
                else if (chartType === 'phase') ppt = pt.angle;
                else if(chartType === 'real') ppt = pt.re;
                else if(chartType === 'imaginary') ppt = pt.im;
                pt1.push(ppt);
                pt2.push(pt.angle[1]);

                ymin1 =(ppt[1] < ymin1) ? ppt[1] : ymin1;
                ymax1 =(ppt[1] > ymax1) ? ppt[1] : ymax1;
                min =(pt.angle[1] < min) ? pt.angle[1] : min;
                max =(pt.angle[1] > max) ? pt.angle[1] : max;
            }
            pchart.push(pt1);
            pcolor.push(pt2);
        } 
        const ymin = ymin1 - scaleFactor[1]*(ymax1-ymin1);
        const ymax = ymax1 + scaleFactor[1]*(ymax1-ymin1);
    
        for(i=nx-1; i >= 0; --i){
            for(j=nz-1; j >= 0; --j){
                pchart[i][j] = this.NormalizePoint(pchart[i][j], xmin, xmax, ymin, ymax, zmin, zmax, scaleFactor);         
            }
        } 

        let p0:vec3, p1:vec3, p2:vec3, p3:vec3;
        let pp0, pp1, pp2, pp3;
        let vertex = [] as any, color = [] as any;   
        i=nz-1;
        while(i--){
            j=nz-1;
            while(j--){
                p0 = pchart[i][j];                
                p1 = pchart[i][j+1];
                p2 = pchart[i+1][j+1];
                p3 = pchart[i+1][j];
                pp0 = pcolor[i][j];
                pp1 = pcolor[i][j+1];
                pp2 = pcolor[i+1][j+1];
                pp3 = pcolor[i+1][j];
                let data = this.CreateQuad1(p0, p1, p2, p3, pp0, pp1, pp2, pp3, min, max, colors);                            
                vertex.push(data.vertex.flat());               
                color.push(data.color.flat());
            }
        }      
        return{
            vertexData: new Float32Array(vertex.flat()),
            colorData: new Float32Array(color.flat())
        }
    }


    private static CreateQuad(p0:vec3, p1:vec3, p2:vec3, p3:vec3, pp0:number, pp1:number, pp2:number, pp3:number, min:number, max:number, colors:any){
        let vertex = [] as any, normal = [] as any, color = [] as any;
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

       //color data
       let c0 = this.AddColors(colors, min, max, pp0);
       let c1 = this.AddColors(colors, min, max, pp1);
       let c2 = this.AddColors(colors, min, max, pp2);
       let c3 = this.AddColors(colors, min, max, pp3);
       color.push([
           c0[0],c0[1],c0[2],c1[0],c1[1],c1[2],c2[0],c2[1],c2[2],
           c2[0],c2[1],c2[2],c3[0],c3[1],c3[2],c0[0],c0[1],c0[2]
       ]);

       return{
           vertex,
           normal, 
           color
       }
    }

    private static CreateQuad1(p0:vec3, p1:vec3, p2:vec3, p3:vec3, pp0:number, pp1:number, pp2:number, pp3:number, min:number, max:number, colors:any){
        let vertex = [] as any, color = [] as any;
        //vertex data
        vertex.push([
            p0[0],p0[1],p0[2],p1[0],p1[1],p1[2],p2[0],p2[1],p2[2],
            p2[0],p2[1],p2[2],p3[0],p3[1],p3[2],p0[0],p0[1],p0[2]
        ]);

       //color data
       let c0 = this.AddColors(colors, min, max, pp0);
       let c1 = this.AddColors(colors, min, max, pp1);
       let c2 = this.AddColors(colors, min, max, pp2);
       let c3 = this.AddColors(colors, min, max, pp3);
       color.push([
           c0[0],c0[1],c0[2],c1[0],c1[1],c1[2],c2[0],c2[1],c2[2],
           c2[0],c2[1],c2[2],c3[0],c3[1],c3[2],c0[0],c0[1],c0[2]
       ]);

       return{
           vertex,
           color
       }
    }

    private static NormalizePoint(pt:vec3, xmin:number, xmax:number, ymin:number, ymax:number, zmin:number, zmax:number, scaleFactor:any){
        pt[0] = scaleFactor[0] * (-1 + 2 * (pt[0] - xmin) / (xmax - xmin));
        pt[1] = scaleFactor[0] * (-1 + 2 * (pt[1] - ymin) / (ymax - ymin));
        pt[2] = scaleFactor[0] * (-1 + 2 * (pt[2] - zmin) / (zmax - zmin));
        return pt;
    }

    private static AddColors(colors:any, min:number, max:number, x:number ){ 
        if(x<min) x = min;
        if(x>max) x = max;
        if(min == max)  return [0,0,0];        
        const xn = (x-min)/(max-min);
        return interp(colors, xn);        
    }

    private static CFunc(f:string, x:number, y:number, a:number = 0, b:number=0, c:number=0, d:number=0) {
        const parse = parser();
        let fz = 'f(x,y,a,b,c,d) = ' + f.replace(/z/g, '(x+i*y)');
        parse.evaluate(fz);
        let fc = parse.evaluate('f(' + x + ',' + y + ',' + a + ',' + b + ',' + c + ',' + d + ')');
        return {
            im: vec3.fromValues(x, fc.im, y),
            mag: vec3.fromValues(x, fc.abs(), y),
            angle: vec3.fromValues(x, arg(fc), y),
            re:vec3.fromValues(x, fc.re, y),
        }
    }   
}