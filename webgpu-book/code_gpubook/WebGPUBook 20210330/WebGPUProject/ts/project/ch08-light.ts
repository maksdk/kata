import { mat4, vec3 } from 'gl-matrix';
import { Transforms as T3D } from '../common/transforms';
import { Ch08Shaders } from '../common/shaders';
const createCamera = require('3d-view-controls');

export class Ch08 {
    public static isAnimation  = true;
    public static vertexData: Float32Array;
    public static normalData: Float32Array; 
       
    static async CreateShape() {
        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;
        
        //create vertices
        const vertexBuffer = T3D.CreateGPUBuffer(device, this.vertexData);       
        const normalBuffer = T3D.CreateGPUBuffer(device, this.normalData);
       
        //create uniform data       
        T3D.CameraPosition = [2, 2, 4];
        const normalMatrix = mat4.create();
        const modelMatrix = mat4.create();
        let vMatrix = mat4.create();
        let vpMatrix = mat4.create();
        const vp = T3D.CreateViewProjection(true, gpu.canvas.width/gpu.canvas.height);       
        vpMatrix = vp.viewProjectionMatrix;    
       
        let rotation = vec3.fromValues(0, 0, 0);       
        let camera = createCamera(gpu.canvas, vp.cameraOption);
        let eyePosition = new Float32Array(T3D.CameraPosition);
        let lightPosition = eyePosition;
        
        //create uniform buffer and layout
        const vertexUniformBuffer = device.createBuffer({
            size: 192,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const fragmentUniformBuffer = device.createBuffer({
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        if(this.isAnimation){
            device.queue.writeBuffer(vertexUniformBuffer, 0, vp.viewProjectionMatrix as ArrayBuffer);
            device.queue.writeBuffer(fragmentUniformBuffer, 0, lightPosition);
            device.queue.writeBuffer(fragmentUniformBuffer, 16, eyePosition);
        }

        const sceneUniformBindGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    type: "uniform-buffer"
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    type: "uniform-buffer"
                }               
            ]
        });

        const sceneUniformBindGroup = device.createBindGroup({
            layout: sceneUniformBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: vertexUniformBuffer
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: fragmentUniformBuffer
                    }
                }                
            ]
        });
       
        const shaders = Ch08Shaders.wgslShaders();
        const pipeline = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [sceneUniformBindGroupLayout]
            }),
            vertexStage: {
                module: device.createShaderModule({                   
                    code: shaders.vertex                           
                }),
                entryPoint: "main"
            },
            fragmentStage: {
                module: device.createShaderModule({                       
                    code: shaders.fragment       
                }),
                entryPoint: "main"
            },
            primitiveTopology: "triangle-list",           
            depthStencilState: {
                format: "depth24plus",
                depthWriteEnabled: true,
                depthCompare: "less"
            },
            vertexState: {
                vertexBuffers: [
                    {
                        arrayStride: 12,
                        attributes: [{
                            shaderLocation: 0,
                            format: "float3",
                            offset: 0
                        }]
                    },
                    {
                        arrayStride: 12,
                        attributes: [{
                            shaderLocation: 1,
                            format: "float3",
                            offset: 0
                        }]
                    }
                ]
            },
            colorStates: [{
                format: gpu.swapChainFormat as any
            }],
            rasterizationState:{
                cullMode : 'back'
            }
        });

        //render pass        
        const depthTexture = device.createTexture({
            size: [gpu.canvas.width, gpu.canvas.height, 1],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        })

        const renderPassDescription = {
            colorAttachments: [{
                attachment: gpu.swapChain.getCurrentTexture().createView(),
                loadValue: [0.5, 0.5, 0.8, 1.0]
            }],
            depthStencilAttachment: {
                attachment: depthTexture.createView(),
                depthLoadValue: 1,
                depthStoreOp: "store",
                stencilLoadValue: 0,
                stencilStoreOp: "store"
            }
        };

        function draw() {
            if(!Ch08.isAnimation){
                if(camera.tick()){
                    const pMatrix = vp.projectionMatrix;
                    vMatrix = camera.matrix;
                    mat4.multiply(vpMatrix, pMatrix, vMatrix);

                    eyePosition = new Float32Array(camera.eye.flat());
                    lightPosition = eyePosition;
                    device.queue.writeBuffer(vertexUniformBuffer, 0, vpMatrix as ArrayBuffer);
                    device.queue.writeBuffer(fragmentUniformBuffer, 0, eyePosition);
                    device.queue.writeBuffer(fragmentUniformBuffer, 16, lightPosition);
                }
            }
            
            T3D.CreateTransforms(modelMatrix,[0,0,0], rotation as vec3, [1,1,1]);
            mat4.invert(normalMatrix, modelMatrix);
            mat4.transpose(normalMatrix,normalMatrix);
            device.queue.writeBuffer(vertexUniformBuffer, 64, modelMatrix as ArrayBuffer);
            device.queue.writeBuffer(vertexUniformBuffer, 128, normalMatrix as ArrayBuffer);

            renderPassDescription.colorAttachments[0].attachment = gpu.swapChain.getCurrentTexture().createView();
            const commandEncoder = device.createCommandEncoder();
            const renderPass = commandEncoder.beginRenderPass(renderPassDescription as GPURenderPassDescriptor);

            renderPass.setPipeline(pipeline);
            renderPass.setVertexBuffer(0, vertexBuffer);
            renderPass.setVertexBuffer(1, normalBuffer);
            renderPass.setBindGroup(0, sceneUniformBindGroup);
            renderPass.draw(Ch08.vertexData.length/3, 1, 0, 0);
            renderPass.endPass();
            device.queue.submit([commandEncoder.finish()]);
        }

        T3D.CreateAnimation(draw, rotation, this.isAnimation);  
    } 
}
