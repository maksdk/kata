import { mat4, vec3 } from 'gl-matrix';
import { Transforms as T3D } from '../common/transforms';
import { Ch11Shaders } from '../common/shaders';
import { Textures } from '../common/textures'
const createCamera = require('3d-view-controls');

export class Ch11 {
    public static isAnimation  = true;
    public static textureFile = 'whitesquare2.png';
    public static colormapName = 'jet';
    public static vertexData:Float32Array;  
    public static normalData:Float32Array;
    public static colorData:Float32Array;
    public static uvData:Float32Array;
    
    static async CreateShape() {
        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;
        
        //create vertices
        const vertexBuffer = T3D.CreateGPUBuffer(device, this.vertexData);       
        const normalBuffer = T3D.CreateGPUBuffer(device, this.normalData);
        const colorBuffer = T3D.CreateGPUBuffer(device, this.colorData);
        const uvBuffer = T3D.CreateGPUBuffer(device, this.uvData);
 
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
               
        //create render pipeline
        const shader = Ch11Shaders.wgslShaders();
        const pipeline = device.createRenderPipeline({
            vertex: {
                module: device.createShaderModule({                   
                    code: shader.vertex                            
                }),
                entryPoint: "main",
                buffers: [
                    {
                        arrayStride: 12,
                        attributes: [{
                            shaderLocation: 0,
                            format: "float32x3",
                            offset: 0
                        }]
                    },
                    {
                        arrayStride: 12,
                        attributes: [{
                            shaderLocation: 1,
                            format: "float32x3",
                            offset: 0
                        }]
                    },
                    {
                        arrayStride: 8,
                        attributes: [{
                            shaderLocation: 2,
                            format: "float32x2",
                            offset: 0
                        }]
                    },
                    {
                        arrayStride: 12,
                        attributes: [{
                            shaderLocation: 3,
                            format: "float32x3",
                            offset: 0
                        }]
                    },
                ]
            },
            fragment: {
                module: device.createShaderModule({                       
                    code: shader.fragment        
                }),
                entryPoint: "main",
                targets: [
                    {
                        format: gpu.format as GPUTextureFormat
                    }
                ]
            },
            primitive: {
                topology: "triangle-list"      
            },     
            depthStencil: {
                format: "depth24plus",
                depthWriteEnabled: true,
                depthCompare: "less"
            }
        });

           //create uniform buffer and layout
           const vertexUniformBuffer = device.createBuffer({
            size: 192,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const fragmentUniformBuffer = device.createBuffer({
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        if(Ch11.isAnimation){
            device.queue.writeBuffer(vertexUniformBuffer, 0, vp.viewProjectionMatrix as ArrayBuffer);
            device.queue.writeBuffer(fragmentUniformBuffer, 0, lightPosition);
            device.queue.writeBuffer(fragmentUniformBuffer, 16, eyePosition);
        }

        Textures.addressModeU = 'clamp-to-edge';
        Textures.addressModeV = 'clamp-to-edge';
        const ts = await Textures.CreateTexture(device,this.textureFile);
        const sceneUniformBindGroup = device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: vertexUniformBuffer,                      
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: fragmentUniformBuffer,
                    }
                },
                {
                    binding: 2,
                    resource: ts.sampler
                },
                {
                    binding: 3,
                    resource: ts.texture.createView()
                }         
            ]
        });

        //render pass        
        const depthTexture = device.createTexture({
            size: [gpu.canvas.width, gpu.canvas.height, 1],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        })

        const renderPassDescription = {
            colorAttachments: [{
                view: gpu.context.getCurrentTexture().createView(),
                loadValue: [0.5, 0.5, 0.8, 1.0],
                storeOp: 'store'
            }],
            depthStencilAttachment: {
                view: depthTexture.createView(),
                depthLoadValue: 1,
                depthStoreOp: "store",
                stencilLoadValue: 0,
                stencilStoreOp: "store"
            }
        };

        function draw() {
            if(!Ch11.isAnimation){
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

            renderPassDescription.colorAttachments[0].view = gpu.context.getCurrentTexture().createView();
            const commandEncoder = device.createCommandEncoder();
            const renderPass = commandEncoder.beginRenderPass(renderPassDescription as GPURenderPassDescriptor);

            renderPass.setPipeline(pipeline);
            renderPass.setVertexBuffer(0, vertexBuffer);
            renderPass.setVertexBuffer(1, normalBuffer);
            renderPass.setVertexBuffer(2, uvBuffer);
            renderPass.setVertexBuffer(3, colorBuffer);

            renderPass.setBindGroup(0, sceneUniformBindGroup);
            renderPass.draw(Ch11.vertexData.length/3, 1, 0, 0);
            renderPass.endPass();
            device.queue.submit([commandEncoder.finish()]);
        }

        T3D.CreateAnimation(draw, rotation, this.isAnimation);  
    } 
}
