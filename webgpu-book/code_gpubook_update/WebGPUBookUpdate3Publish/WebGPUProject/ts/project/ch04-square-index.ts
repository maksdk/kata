import { NavBar } from '../common/navbar';
import { Ch04Shaders } from '../common/shaders'

export class Ch04SquareIndex {
    static async CreateSquareIndex() {
        const checkgpu = NavBar.CheckWebGPU();
        if(checkgpu.includes('Your current browser does not support WebGPU!')){
            console.log(checkgpu);
            throw('Your current browser does not support WebGPU!');
        }

        const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;       
        const adapter = await navigator.gpu?.requestAdapter();
        const device = await adapter?.requestDevice() as GPUDevice;
        const context = canvas.getContext('webgpu') as GPUCanvasContext;
        const format = 'bgra8unorm';       
        context.configure({
            device: device,
            format: format
        });

        const vertexBuffer = device.createBuffer({
            size: 4*(2+3)*4,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true
        });
        const vertexData = new Float32Array([
             //position    //color
            -0.5, -0.5,    1, 0, 0,
             0.5, -0.5,    0, 1, 0,
            -0.5,  0.5,    1, 1, 0,    
             0.5,  0.5,    0, 0, 1
                
        ]);
        new Float32Array(vertexBuffer.getMappedRange()).set(vertexData);
        vertexBuffer.unmap();

        const indexData = new Uint32Array( [0, 1, 2, 1, 3, 2] );

        const indexBuffer = device.createBuffer({
            size: indexData.byteLength,
            usage: GPUBufferUsage.INDEX,
            mappedAtCreation: true
        });
      
        new Uint32Array(indexBuffer.getMappedRange()).set(indexData);
        indexBuffer.unmap();

        const pipeline = device.createRenderPipeline({
            vertex: {
                module: device.createShaderModule({
                    code: Ch04Shaders.wgslShaders.vertex
                }),
                entryPoint: "main",
                buffers: [
                    {
                        arrayStride: 4*(2+3),
                        attributes: [{
                            shaderLocation: 0,
                            format: "float32x2",
                            offset: 0
                        },
                        {
                            shaderLocation: 1,
                            offset: 4*2,
                            format: 'float32x3'
                        }
                        ]
                    },                   
                ]
            },
            fragment: {
                module: device.createShaderModule({
                    code: Ch04Shaders.wgslShaders.fragment
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
                loadValue: [0.5,0.5,0.8,1],
                storeOp: 'store'
            }]
        });
        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setIndexBuffer(indexBuffer, "uint32");
        
        renderPass.drawIndexed(6);
        renderPass.endPass();
        device.queue.submit([commandEncoder.finish()]);
    } 
}

Ch04SquareIndex.CreateSquareIndex();