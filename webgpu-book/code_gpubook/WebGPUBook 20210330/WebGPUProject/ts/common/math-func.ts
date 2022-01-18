import { vec3 } from 'gl-matrix';

export class MathFunc {
    public static Float32ArrayConcat(first:Float32Array, second:Float32Array){
        var firstLength = first.length,
        result = new Float32Array(firstLength + second.length);
        result.set(first);
        result.set(second, firstLength);
        return result;
    }

    public static Torus(u:number, v:number, center:vec3=[0,0,0]):vec3{
        let x = (1+0.3*Math.cos(v))*Math.cos(u);    
        let y = 0.3*Math.sin(v);
        let z = (1+0.3*Math.cos(v))*Math.sin(u);  
        return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
    }

    public static Sphere(u:number, v:number, center:vec3=[0,0,0]):vec3{
        let x = Math.cos(v)*Math.cos(u);       
        let y = Math.sin(v);
        let z = Math.cos(v)*Math.sin(u);        
        return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
    }

    public static RadialWave(u:number, v:number, center:vec3=[0,0,0]):vec3{
        let x = Math.sin(v/2);       
        let y = Math.sin(4*Math.PI*u) + Math.cos(2*Math.PI*v);
        let z = Math.sin(u);        
        return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
    }

    public static Wellenkugel(u:number, v:number, center:vec3=[0,0,0]):vec3{
        let x = u*Math.cos(Math.cos(u))*Math.sin(v);        
        let y = u*Math.sin(Math.cos(u));
        let z = u*Math.cos(Math.cos(u))*Math.cos(v);       
        return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
    }

    public static KleinBottle(u:number, v:number, center:vec3=[0,0,0]):vec3{
        let x = 2/15*(3+5*Math.cos(u)*Math.sin(u))*Math.sin(v);    

        let y = -1/15*Math.sin(u)*(3*Math.cos(v)-3*Math.pow(Math.cos(u),2)*Math.cos(v)-
                48*Math.pow(Math.cos(u),4)*Math.cos(v)+48*Math.pow(Math.cos(u),6)*Math.cos(v)-
                60*Math.sin(u)+5*Math.cos(u)*Math.cos(v)*Math.sin(u)- 
                5*Math.pow(Math.cos(u),3)*Math.cos(v)*Math.sin(u)-
                80*Math.pow(Math.cos(u),5)*Math.cos(v)*Math.sin(u)+
                80*Math.pow(Math.cos(u),7)*Math.cos(v)*Math.sin(u));

        let z = -2/15*Math.cos(u)*(3*Math.cos(v)-30*Math.sin(u)+
                90*Math.pow(Math.cos(u),4)*Math.sin(u)-60*Math.pow(Math.cos(u),6)*Math.sin(u)+
                5*Math.cos(u)*Math.cos(v)*Math.sin(u));
       
        return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
    }


    public static Helicoid(u:number, v:number, center:vec3):vec3{
        let x = u*Math.cos(v);
        let z = u*Math.sin(v);
        let y = v;
        return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
    }

    public static Peaks(x:number, z:number, center:vec3):vec3{
        let y = 3*(1-x)*(1-x)*Math.exp(-(x*x)-(z+1)*(z+1))-10*(x/5-x*x*x-z*z*z*z*z)*Math.exp(-x*x-z*z)-
                1/3*Math.exp(-(x+1)*(x+1)-z*z)
        return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
    }

    public static ExpFunc(x:number, z:number, center:vec3):vec3{
        let y = Math.exp(Math.cos(Math.sqrt(x*x+z*z)));
        return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
    }

    public static Sinc(x:number, z:number, center:vec3 = [0,0,0]):vec3{
        let r = Math.sqrt(x*x + z*z) + 0.00001;
        let y = Math.sin(r)/r;
        return vec3.fromValues(x+center[0], y+center[1], z+center[2]);
    }

    public static SpherePosition(radius:number, theta:number, phi:number, center:vec3 = [0,0,0]){
        let snt = Math.sin(theta*Math.PI/180);
        let cnt = Math.cos(theta*Math.PI/180);
        let snp = Math.sin(phi*Math.PI/180);
        let cnp = Math.cos(phi*Math.PI/180);
        return vec3.fromValues(radius*snt*cnp + center[0], radius*cnt + center[1], -radius*snt*snp + center[2]);     
    }

    public static CylinderPosition(radius:number, theta:number, y:number, center:vec3 = [0,0,0]){
        let sn = Math.sin(theta*Math.PI/180);
        let cn = Math.cos(theta*Math.PI/180);
        return vec3.fromValues(radius*cn + center[0], y+center[1], -radius*sn + center[2]);        
    }

    public static ConePosition(radius:number, theta:number, y:number, center:vec3 = [0,0,0]){
        let sn = Math.sin(theta*Math.PI/180);
        let cn = Math.cos(theta*Math.PI/180);
        return vec3.fromValues(radius*cn + center[0], y + center[1], -radius*sn + center[2]);        
    }

    public static TorusPosition(R:number, r:number, u:number, v:number, center:vec3 = [0,0,0]){
        let snu = Math.sin(u*Math.PI/180);
        let cnu = Math.cos(u*Math.PI/180);
        let snv = Math.sin(v*Math.PI/180);
        let cnv = Math.cos(v*Math.PI/180);
        return vec3.fromValues((R+r*cnv)*cnu + center[0], r*snv + center[1], -(R+r*cnv)*snu + center[2]);        
    }

}