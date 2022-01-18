import { NavBar } from '../common/navbar';
import { Ch04Shaders } from '../common/shaders'

export class Ch04Square {
    static async CreateSquare() {
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

        const vertexBuffer = device.createBuffer({
            size: 4*(2+3)*3 *2,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true
        });
        const vertexData = new Float32Array([
             //position    //color
            -0.5, -0.5,    1, 0, 0,
             0.5, -0.5,    0, 1, 0,
            -0.5,  0.5,    1, 1, 0,
            -0.5,  0.5,    1, 1, 0,
             0.5, -0.5,    0, 1, 0,
             0.5,  0.5,    0, 0, 1
        ]);
        new Float32Array(vertexBuffer.getMappedRange()).set(vertexData);
        vertexBuffer.unmap();
        
        const pipeline = device.createRenderPipeline({
            vertexStage: {
                module: device.createShaderModule({
                    code: Ch04Shaders.wgslShaders.vertex
                }),
                entryPoint: "main"
            },
            fragmentStage: {
                module: device.createShaderModule({
                    code: Ch04Shaders.wgslShaders.fragment
                }),
                entryPoint: "main"
            },
            primitiveTopology: "triangle-list",
            vertexState: {
                vertexBuffers: [
                    {
                        arrayStride: 4*(2+3),
                        attributes: [{
                            shaderLocation: 0,
                            format: "float2",
                            offset: 0
                        },
                        {
                            shaderLocation: 1,
                            offset: 4*2,
                            format: 'float3'
                        }
                        ]
                    },                   
                ]
            },
            colorStates: [{
                format: swapChainFormat
            }]
        });

        const commandEncoder = device.createCommandEncoder();
        const textureView = swapChain.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                attachment: textureView,
                loadValue: [0.5,0.5,0.8,1]
            }]
        });
        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
        
        renderPass.draw(6);
        renderPass.endPass();

        device.queue.submit([commandEncoder.finish()]);
    } 
}

Ch04Square.CreateSquare();