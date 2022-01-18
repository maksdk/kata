import { NavBar } from '../common/navbar';
import { Ch03Shaders } from '../common/shaders';

export class Ch03Point {
    static async CreatePoints() {
        const checkgpu = NavBar.CheckWebGPU();
        if(checkgpu.includes('Your current browser does not support WebGPU!')){
            console.log(checkgpu);
            throw('Your current browser does not support WebGPU!');
        }

        const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;        
        const adapter = await navigator.gpu?.requestAdapter() as GPUAdapter;       
        const device = await adapter?.requestDevice() as GPUDevice;
        const context = canvas.getContext('webgpu') as GPUCanvasContext;

        const format = 'bgra8unorm';       
        context.configure({
            device: device,
            format: format
        });
        
        const pipeline = device.createRenderPipeline({
            vertex: {
                module: device.createShaderModule({                    
                    code: Ch03Shaders.wgslShaders.vertex
                }),
                entryPoint: "main"
            },
            fragment: {
                module: device.createShaderModule({                    
                    code: Ch03Shaders.wgslShaders.fragment
                }),
                entryPoint: "main",
                targets: [{
                    format: format as GPUTextureFormat
                }]
            },
            primitive: {
                topology: "point-list"
            }
           
        });

        const commandEncoder = device.createCommandEncoder();
        const textureView = context.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                loadValue: [0.5, 0.5, 0.5, 1], //background color
                storeOp: 'store'
            }]
        });
        renderPass.setPipeline(pipeline);
        renderPass.draw(6, 1, 0, 0);
        renderPass.endPass();

        device.queue.submit([commandEncoder.finish()]);
    }
}

Ch03Point.CreatePoints();