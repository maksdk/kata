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
        const context = canvas.getContext('webgpu') as GPUCanvasContext;
        const format = 'bgra8unorm';       
        context.configure({
            device: device,
            format: format
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
            size: 48,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });

        const colorArray = new Float32Array([
              1, 0, 0, 1,
              0, 1, 0, 1,
              0, 0, 1, 1
        ]);
        new Float32Array(colorBuffer.getMappedRange()).set(colorArray);
        colorBuffer.unmap();

        const pipeline = device.createRenderPipeline({
            vertex: {
                module: device.createShaderModule({
                    code: Ch04Shaders.wgslShaders.vertex
                }),
                entryPoint: "main",
                buffers: [
                    {
                        arrayStride: 8,
                        attributes: [{
                            shaderLocation: 0,
                            format: "float32x2",
                            offset: 0
                        }]
                    },
                    {
                        arrayStride: 16,
                        attributes: [{
                            shaderLocation: 1,
                            format: "float32x4",
                            offset: 0
                        }]
                    }
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
        renderPass.setVertexBuffer(1, colorBuffer);

        renderPass.draw(3, 1, 0, 0);
        renderPass.endPass();

        device.queue.submit([commandEncoder.finish()]);
    } 
}

Ch04TriangleColor.CreateTriangleColor();
