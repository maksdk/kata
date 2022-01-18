import glslangModule from '@webgpu/glslang/dist/web-devel-onefile/glslang';
import { NavBar } from '../common/navbar';
import { Ch02Shaders } from '../common/shaders'

export class TriangleGlsl {
    static async CreateTriangle() {
        const checkgpu = NavBar.CheckWebGPU();
        if(checkgpu.includes('Your current browser does not support WebGPU!')){
            console.log(checkgpu);
            throw('Your current browser does not support WebGPU!');
        }

        const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;        
        const adapter = await navigator.gpu?.requestAdapter() as GPUAdapter;       
        const glslang = await glslangModule() as any;
        const device = await adapter?.requestDevice() as GPUDevice;
        const context = canvas.getContext('webgpu') as GPUCanvasContext;
        const format = 'bgra8unorm';
        context.configure({
            device: device,
            format: format,
        });
        
        const pipeline = device.createRenderPipeline({
            vertex: {
                module: device.createShaderModule({                    
                    code: glslang.compileGLSL(Ch02Shaders.glslShaders.vertex, "vertex")
                }),
                entryPoint: "main"
            },
            fragment: {
                module: device.createShaderModule({                    
                    code: glslang.compileGLSL(Ch02Shaders.glslShaders.fragment, "fragment")
                }),
                entryPoint: "main",
                targets: [{
                    format: format as GPUTextureFormat
                }]
            },
            primitive: {
                topology: "triangle-list"          
            }
        });

        const commandEncoder = device.createCommandEncoder();
        const textureView = context.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                loadValue: [0.5, 0.5, 0.8, 1], //background color
                storeOp: 'store'
            }]
        });
        renderPass.setPipeline(pipeline);
        renderPass.draw(3, 1, 0, 0);
        renderPass.endPass();

        device.queue.submit([commandEncoder.finish()]);
    }
}

TriangleGlsl.CreateTriangle();
