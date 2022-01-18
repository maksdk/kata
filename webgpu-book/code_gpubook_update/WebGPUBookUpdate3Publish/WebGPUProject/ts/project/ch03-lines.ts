import { NavBar } from '../common/navbar';
import { Ch03Shaders } from '../common/shaders';
import $ from 'jquery';

export class Ch03Line {
    public static IsLineStripe = false;

    static async CreateLines() {
        const checkgpu = NavBar.CheckWebGPU();
        if(checkgpu.includes('Your current browser does not support WebGPU!')){
            console.log(checkgpu);
            throw('Your current browser does not support WebGPU!');
        }

        let topology = 'line-list';
        let indexFormat = undefined;
        if(this.IsLineStripe){
            topology = "line-strip";
            indexFormat = "uint32";
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
                topology: topology as GPUPrimitiveTopology,
                stripIndexFormat: indexFormat as GPUIndexFormat
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
        renderPass.draw(6, 1, 0, 0);
        renderPass.endPass();

        device.queue.submit([commandEncoder.finish()]);
    }
}

Ch03Line.CreateLines();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'line-strip') Ch03Line.IsLineStripe = true;
    else Ch03Line.IsLineStripe = false;
    Ch03Line.CreateLines();
});
