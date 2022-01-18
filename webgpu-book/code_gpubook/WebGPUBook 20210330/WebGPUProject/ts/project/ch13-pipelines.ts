import { mat4, vec3 } from 'gl-matrix';
import { Transforms as T3D } from '../common/transforms';
import { ShapeData } from '../common/shape-data';
import { Ch06Shaders, Ch10Shaders } from '../common/shaders';
import { Textures } from '../common/textures'

export class Ch13Pipelines {
    static async CreateObjects() {
        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;
        
        //create sphere vertices
        const data = ShapeData.SphereData(1.5,70,40);
        const vertexBuffer = T3D.CreateGPUBuffer(device, data?.vertexData as Float32Array);       
        const normalBuffer = T3D.CreateGPUBuffer(device, data?.normalData as Float32Array);
        const uvBuffer = T3D.CreateGPUBuffer(device, data?.uvData as Float32Array);

        //create cube vertices
        const cubeVertexSize = 4 * 8;  // Byte size of one cube vertex.
        const cubeColorOffset = 4 * 3; // Byte offset of cube vertex color attribute.
        const cubeData = ShapeData.CubeData1();        
        const vertexBuffer2 = T3D.CreateGPUBuffer(device, cubeData);

       T3D.CameraPosition = [2,2,4];           
       const vp = T3D.CreateViewProjection(true, gpu.canvas.width/gpu.canvas.height); 
       let rotation = vec3.fromValues(0, 0, 0);  

       //for sphere
       let eyePosition = new Float32Array(T3D.CameraPosition);
       let lightPosition = eyePosition;
       const normalMatrix = mat4.create();  
       const modelMatrix1 = mat4.create();
       const translateMatrix1 = mat4.create();
       T3D.CreateTransforms(translateMatrix1,[-2.5,-1.2,0.5], [0,0,0], [1,1,1]);
             
       //for cube
       const modelMatrix2 = mat4.create();
       const modelViewProjectionMatrix2 = mat4.create();
       const translateMatrix2 = mat4.create();
       T3D.CreateTransforms(translateMatrix2,[1,0.5,-2], [0,0,0], [1,1,1]);
      
        //create uniform buffer and layout for sphere
        const vertexUniformBuffer = device.createBuffer({
            size: 192,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const fragmentUniformBuffer = device.createBuffer({
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        
        device.queue.writeBuffer(vertexUniformBuffer, 0, vp.viewProjectionMatrix as ArrayBuffer);
        device.queue.writeBuffer(fragmentUniformBuffer, 0, lightPosition);
        device.queue.writeBuffer(fragmentUniformBuffer, 16, eyePosition);

        const sceneUniformBindGroupLayout1 = device.createBindGroupLayout({
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
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    type: "sampler"
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    type: "sampled-texture"
                }      
            ]
        });

        //get texture and sampler data for sphere
        const ts = await Textures.CreateTexture(device, 'earth.png');
        const sceneUniformBindGroup1 = device.createBindGroup({
            layout: sceneUniformBindGroupLayout1,
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

        //create uniform buffer and layout for cube
        const sceneUniformBuffer2 = device.createBuffer({
            size: 64,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const sceneUniformBindGroupLayout2 = device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                type: "uniform-buffer"
            }]
        });

        const sceneUniformBindGroup2 = device.createBindGroup({
            layout: sceneUniformBindGroupLayout2,
            entries: [{
                binding: 0,
                resource: {
                    buffer: sceneUniformBuffer2
                }
            }]
        });
       
        //create render pipeline for sphere
        const shader = Ch10Shaders.wgslShaders();
        const pipeline1 = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [sceneUniformBindGroupLayout1]
            }),
            vertexStage: {
                module: device.createShaderModule({                   
                    code: shader.vertex                            
                }),
                entryPoint: "main"
            },
            fragmentStage: {
                module: device.createShaderModule({                       
                    code: shader.fragment        
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
                    },
                    {
                        arrayStride: 8,
                        attributes: [{
                            shaderLocation: 2,
                            format: "float2",
                            offset: 0
                        }]
                    }
                ]
            },
            colorStates: [{
                format: gpu.swapChainFormat as any
            }]
        });

        //create render pipeline for sphere
        const pipeline2 = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [sceneUniformBindGroupLayout2]
            }),
            vertexStage: {
                module: device.createShaderModule({
                    code: Ch06Shaders.wgslShaders.vertex                   
                }),
                entryPoint: "main"
            },
            fragmentStage: {
                module: device.createShaderModule({
                    code: Ch06Shaders.wgslShaders.fragment                 
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
                        arrayStride: cubeVertexSize,
                        attributes: [
                            {
                              // position
                              shaderLocation: 0,
                              offset: 0,
                              format: 'float3',
                            },
                            {
                              // color
                              shaderLocation: 1,
                              offset: cubeColorOffset,
                              format: 'float3',
                            },
                        ],
                    }
                ]
            },
            rasterizationState:{
                cullMode : 'back'
            },
            colorStates: [{
                format: gpu.swapChainFormat as GPUTextureFormat
            }]
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
            //transforms on sphere
            mat4.rotate(
                modelMatrix1, 
                translateMatrix1, 
                1, 
                vec3.fromValues(Math.cos(rotation[0]*2), Math.sin(rotation[0]*2), 0)
            );            
            mat4.invert(normalMatrix, modelMatrix1);
            mat4.transpose(normalMatrix,normalMatrix);
            device.queue.writeBuffer(vertexUniformBuffer, 64, modelMatrix1 as ArrayBuffer);
            device.queue.writeBuffer(vertexUniformBuffer, 128, normalMatrix as ArrayBuffer);
            device.queue.writeBuffer(sceneUniformBuffer2, 0, modelViewProjectionMatrix2 as ArrayBuffer);            

            //transforms on cube
            mat4.rotate(
                modelMatrix2, 
                translateMatrix2, 
                1, 
                vec3.fromValues(Math.cos(rotation[1]*2), 0, Math.sin(rotation[2]*2))
            );        
            mat4.multiply(modelViewProjectionMatrix2, vp.viewMatrix, modelMatrix2);
            mat4.multiply(modelViewProjectionMatrix2, vp.projectionMatrix, modelViewProjectionMatrix2);

            renderPassDescription.colorAttachments[0].attachment = gpu.swapChain.getCurrentTexture().createView();
            const commandEncoder = device.createCommandEncoder();
            const renderPass = commandEncoder.beginRenderPass(renderPassDescription as GPURenderPassDescriptor);

            //draw sphere
            renderPass.setPipeline(pipeline1);
            renderPass.setVertexBuffer(0, vertexBuffer);
            renderPass.setVertexBuffer(1, normalBuffer);
            renderPass.setVertexBuffer(2, uvBuffer);
            renderPass.setBindGroup(0, sceneUniformBindGroup1);
            renderPass.draw((data?.vertexData as Float32Array).length/3, 1, 0, 0);

            //draw cube
            renderPass.setPipeline(pipeline2);
            renderPass.setVertexBuffer(0, vertexBuffer2);          
            renderPass.setBindGroup(0, sceneUniformBindGroup2);
            renderPass.draw(36, 1, 0, 0);

            renderPass.endPass();
            device.queue.submit([commandEncoder.finish()]);
        }

        T3D.CreateAnimation(draw, rotation, true);  
    } 
}

Ch13Pipelines.CreateObjects();