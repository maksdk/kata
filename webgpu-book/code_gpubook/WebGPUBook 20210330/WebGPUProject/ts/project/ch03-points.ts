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
        const context = canvas.getContext('gpupresent') as unknown as GPUCanvasContext;

        const swapChainFormat = 'bgra8unorm';       
        const swapChain = context.configureSwapChain({
            device: device,
            format: swapChainFormat
        });
        
        const pipeline = device.createRenderPipeline({
            vertexStage: {
                module: device.createShaderModule({                    
                    code: Ch03Shaders.wgslShaders.vertex
                }),
                entryPoint: "main"
            },
            fragmentStage: {
                module: device.createShaderModule({                    
                    code: Ch03Shaders.wgslShaders.fragment
                }),
                entryPoint: "main"
            },
            primitiveTopology: "point-list",
            colorStates: [{
                format: swapChainFormat
            }]
        });

        const commandEncoder = device.createCommandEncoder();
        const textureView = swapChain.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                attachment: textureView,
                loadValue: [0.5, 0.5, 0.5, 1] //background color
            }]
        });
        renderPass.setPipeline(pipeline);
        renderPass.draw(6, 1, 0, 0);
        renderPass.endPass();

        device.queue.submit([commandEncoder.finish()]);
    }
}

Ch03Point.CreatePoints();