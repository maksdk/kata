import { vec3, vec2, mat4 } from 'gl-matrix';
import { NavBar } from './navbar'

export class Transforms{    
    public static CameraPosition:vec3 = [2, 2, 4];
    public static LookDirection:vec3 = [0, 0, 0];
    public static UpDirection:vec3 = [0, 1, 0];

    public static CreateViewProjection(isPerspective:boolean, respectRatio:number) {        
        const viewMatrix = mat4.create();
        const projectionMatrix = mat4.create();       
        const viewProjectionMatrix = mat4.create();
 
        if(isPerspective){
            mat4.perspective(projectionMatrix, 2*Math.PI/5, respectRatio, 0.1, 100.0)
        } else {
            mat4.ortho(projectionMatrix, -4, 4, -3, 3, -1, 6);
        }

        mat4.lookAt(viewMatrix, this.CameraPosition, this.LookDirection, this.UpDirection);
        mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

        const cameraOption = {
            eye: this.CameraPosition,
            center: this.LookDirection,
            zoomMax: 100,
            zoomSpeed: 2
        };

        return {
            viewMatrix,
            projectionMatrix,
            viewProjectionMatrix,
            cameraOption
        }
    }

    public static CreateTransforms(modelMat:mat4, translation:vec3, rotation:vec3, scaling:vec3) {
        const rotateXMat = mat4.create();
        const rotateYMat = mat4.create();
        const rotateZMat = mat4.create();   
        const translateMat = mat4.create();
        const scaleMat = mat4.create();

        rotation = rotation || [0, 0, 0];
        translation = translation || [0, 0, 0];
        scaling = scaling || [1, 1, 1];
        
        //perform indivisual transformations
        mat4.fromTranslation(translateMat, translation);
        mat4.fromXRotation(rotateXMat, rotation[0]);
        mat4.fromYRotation(rotateYMat, rotation[1]);
        mat4.fromZRotation(rotateZMat, rotation[2]);
        mat4.fromScaling(scaleMat, scaling);
      
        //combine all transformation matrices together to form a final transform matrix: modelMat
        mat4.multiply(modelMat, rotateXMat, scaleMat);
        mat4.multiply(modelMat, rotateYMat, modelMat);        
        mat4.multiply(modelMat, rotateZMat, modelMat);
        mat4.multiply(modelMat, translateMat, modelMat);
    }

    public static CreateAnimation(draw:any, rotation:vec3, isAnimation = true ){
        function step() {
            if(isAnimation){
                rotation[0] += 0.01;
                rotation[1] += 0.01;
                rotation[2] += 0.01;
            } else{
                rotation = [0, 0, 0];
            }
            draw();
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    public static animateVertex(draw:any, param:vec2, paramRange:any, speed:number){
        let isDecrease = true;
        if(param[0] < paramRange[0] + speed) isDecrease = false;
        function step() {           
            if(param[0] > paramRange[0] && isDecrease) {
                param[0] -= speed;
                isDecrease = true;
                if(param[0]<= paramRange[0]) isDecrease=false;
            }
            else if(param[0] < paramRange[1] && !isDecrease){
                param[0] += speed;
                isDecrease = false;
                if(param[0] >= paramRange[1]) isDecrease = true;
            }

            draw();
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    
    public static Round(vecOrMat : any, numDigits: number){
        const result : any = [];
        for(let i=0;i<vecOrMat.length;i++){
            result.push(Number(vecOrMat[i].toFixed(numDigits)))
        }
        return result;
    }

    public static async InitWebGPU(){
        const checkgpu = NavBar.CheckWebGPU();
        if(checkgpu.includes('Your current browser does not support WebGPU!')){
            console.log(checkgpu);
            throw('Your current browser does not support WebGPU!');
        }
        const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
        const adapter = await navigator.gpu?.requestAdapter();
        const device = await adapter?.requestDevice() as GPUDevice;
        const context = canvas.getContext('gpupresent') as unknown as GPUCanvasContext;
        const swapChainFormat = 'bgra8unorm';
        const swapChain = context.configureSwapChain({
            device: device,
            format: swapChainFormat
        });
        return{device, canvas, swapChainFormat, swapChain };
    }

    public static CreateGPUBuffer(device:GPUDevice, data:Float32Array, usageFlag:GPUBufferUsageFlags = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST){
        const buffer = device.createBuffer({
            size: data.byteLength,
            usage: usageFlag,
            mappedAtCreation: true
        });
        new Float32Array(buffer.getMappedRange()).set(data);
        buffer.unmap();
        return buffer;
    }

   
    /*public static CreateGPUWriteBufferUint8Array(device: GPUDevice, data:Uint8Array){
        const buffer = device.createBuffer({
            size: data.byteLength,
            usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true
        });
        new Uint8Array(buffer.getMappedRange()).set(data);
        buffer.unmap();
        return buffer;
    }

    public static CreateGPUReadBufferUint8Array(device:GPUDevice, size = 4){
        const buffer = device.createBuffer({
            size: size,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
            mappedAtCreation: false
        });
        return buffer;
    }*/
}