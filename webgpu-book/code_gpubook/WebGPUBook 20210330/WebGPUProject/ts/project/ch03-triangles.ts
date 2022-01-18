import { NavBar } from '../common/navbar';
import { Ch03Shaders } from '../common/shaders';
import $ from 'jquery';

export class Ch03Triangle {
    public static IsTriangleStripe = false;

    static async CreateLines() {
        const checkgpu = NavBar.CheckWebGPU();
        if(checkgpu.includes('Your current browser does not support WebGPU!')){
            console.log(checkgpu);
            throw('Your current browser does not support WebGPU!');
        }

        let topology = 'triangle-list';
        let indexFormat = undefined;
        if(this.IsTriangleStripe){
            topology = "triangle-strip";
            indexFormat = "uint32";
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
                    code: Ch03Shaders.wgslShadersTriangle.vertex
                }),
                entryPoint: "main"
            },
            fragmentStage: {
                module: device.createShaderModule({                    
                    code: Ch03Shaders.wgslShadersTriangle.fragment
                }),
                entryPoint: "main"
            },
            primitiveTopology: topology as GPUPrimitiveTopology,
            colorStates: [{
                format: swapChainFormat
            }],
            vertexState: {
                indexFormat: indexFormat as any
           }
        });

        const commandEncoder = device.createCommandEncoder();
        const textureView = swapChain.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                attachment: textureView,
                loadValue: [0.5, 0.5, 0.8, 1] //background color
            }]
        });
        renderPass.setPipeline(pipeline);
        renderPass.draw(9, 1, 0, 0);
        renderPass.endPass();

        device.queue.submit([commandEncoder.finish()]);
    }
}

Ch03Triangle.CreateLines();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'triangle-strip') Ch03Triangle.IsTriangleStripe = true;
    else Ch03Triangle.IsTriangleStripe = false;
    Ch03Triangle.CreateLines();
});
