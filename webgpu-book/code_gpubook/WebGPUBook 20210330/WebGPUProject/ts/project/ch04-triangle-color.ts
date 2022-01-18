import { NavBar } from '../common/navbar';
import { Ch04Shaders } from '../common/shaders'

export class Ch04TriangleColor {
    static async CreateTriangleColor() {
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
            size: 24,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });

        const vertexArray = new Float32Array([
              0.0,  0.5,
             -0.5, -0.5,
              0.5, -0.5
        ]);
        new Float32Array(vertexBuffer.getMappedRange()).set(vertexArray);
        vertexBuffer.unmap();

        const colorBuffer = device.createBuffer({
            size: 12,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });

        const colorArray = new Uint8Array([
            255,   0,   0, 255,
              0, 255,   0, 255,
              0,   0, 255, 255
        ]);
        new Uint8Array(colorBuffer.getMappedRange()).set(colorArray);
        colorBuffer.unmap();

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
                        arrayStride: 8,
                        attributes: [{
                            shaderLocation: 0,
                            format: "float2",
                            offset: 0
                        }]
                    },
                    {
                        arrayStride: 4,
                        attributes: [{
                            shaderLocation: 1,
                            format: "uchar4norm",
                            offset: 0
                        }]
                    }
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
        renderPass.setVertexBuffer(1, colorBuffer);

        renderPass.draw(3, 1, 0, 0);
        renderPass.endPass();

        device.queue.submit([commandEncoder.finish()]);
    } 
}

Ch04TriangleColor.CreateTriangleColor();
