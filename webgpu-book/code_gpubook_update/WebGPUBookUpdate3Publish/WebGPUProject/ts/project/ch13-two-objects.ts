import { mat4, vec3 } from 'gl-matrix';
import { Transforms as T3D } from '../common/transforms';
import { ShapeData } from '../common/shape-data'
import { Ch06Shaders } from '../common/shaders';

export class Ch13TowObjects {
    static async CreateObjects() {
        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;

        //create vertices
        const cubeData = ShapeData.CubeData();
        const numberOfVertices = cubeData.vertices.length / 3;
        const vertexBuffer = T3D.CreateGPUBuffer(device, cubeData.vertices);
        const colorBuffer = T3D.CreateGPUBuffer(device, cubeData.colors);

        //create uniform data       
        const matrixSize = 4*16;
        const uniformOffset = 256;
        const uniformBufferSize = matrixSize*matrixSize;
        let rotation = vec3.fromValues(0, 0, 0);  
        
        const vp = T3D.CreateViewProjection(true, gpu.canvas.width/gpu.canvas.height); 
        const modelMatrix1 = mat4.create();
        const translateMatrix1 = mat4.create();
        T3D.CreateTransforms(translateMatrix1,[-2, -1, 0.5], [0,0,0], [1,1,1]);
        const modelViewProjectionMatrix1 = mat4.create() as Float32Array;
       
        const modelMatrix2 = mat4.create();
        const translateMatrix2 = mat4.create();
        T3D.CreateTransforms(translateMatrix2,[1, 1, -2], [0,0,0], [1,1,1]);      
        const modelViewProjectionMatrix2 = mat4.create() as Float32Array;

        //create uniform buffer and layout
        const sceneUniformBuffer = device.createBuffer({
        size: uniformBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const sceneUniformBindGroupLayout = device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer:{
                    type: 'uniform'
                }
            }]
        });

        const sceneUniformBindGroup1 = device.createBindGroup({
            layout: sceneUniformBindGroupLayout,
            entries: [{
                binding: 0,
                resource: {
                    buffer: sceneUniformBuffer,
                    offset: 0,
                    size: matrixSize
                }
            }]
        });

        const sceneUniformBindGroup2 = device.createBindGroup({
            layout: sceneUniformBindGroupLayout,
            entries:[{
                binding: 0,
                resource:{
                    buffer: sceneUniformBuffer,
                    offset: uniformOffset,
                    size:matrixSize
                }
            }]
        });
    
        //create render pipeline
        const pipeline = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [sceneUniformBindGroupLayout]
            }),
            vertex: {
                module: device.createShaderModule({
                    code: Ch06Shaders.wgslShaders.vertex                   
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
                    }
                ]
            },
            fragment: {
                module: device.createShaderModule({
                    code: Ch06Shaders.wgslShaders.fragment                 
                }),
                entryPoint: "main",
                targets: [
                    {
                        format: gpu.format as GPUTextureFormat
                    }
                ]
            },
            primitive: {
                topology: "triangle-list",
                cullMode: 'back'
            },
            depthStencil: {
                format: "depth24plus",
                depthWriteEnabled: true,
                depthCompare: "less"
            }
        });

        //render pass
        const depthTexture = device.createTexture({
            size: [gpu.canvas.width, gpu.canvas.height, 1],
            format: "depth24plus",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });

        const renderPassDescription = {
            colorAttachments: [{
                view: gpu.context.getCurrentTexture().createView(),
                loadValue: [0.5, 0.5, 0.8, 1],
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

        const draw = () => {
            //transforms on first cube
            mat4.rotate(
                modelMatrix1, 
                translateMatrix1, 
                1, 
                vec3.fromValues(Math.sin(2*rotation[0]), Math.cos(2*rotation[0]), 0)
            );          
            mat4.multiply(modelViewProjectionMatrix1, vp.viewMatrix, modelMatrix1);
            mat4.multiply(modelViewProjectionMatrix1, vp.projectionMatrix, modelViewProjectionMatrix1);

            //transforms on second cube
            mat4.rotate(
                modelMatrix2, 
                translateMatrix2, 
                1, 
                vec3.fromValues(Math.cos(2*rotation[1]), 0, Math.sin(3*rotation[1]))
            );
            mat4.multiply(modelViewProjectionMatrix2, vp.viewMatrix, modelMatrix2);
            mat4.multiply(modelViewProjectionMatrix2, vp.projectionMatrix, modelViewProjectionMatrix2);

            device.queue.writeBuffer(
                sceneUniformBuffer,
                0,
                modelViewProjectionMatrix1.buffer,
                modelViewProjectionMatrix1.byteOffset,
                modelViewProjectionMatrix1.byteLength
            );
            
            device.queue.writeBuffer(
                sceneUniformBuffer,
                uniformOffset,
                modelViewProjectionMatrix2.buffer,
                modelViewProjectionMatrix2.byteOffset,
                modelViewProjectionMatrix2.byteLength
            );

            renderPassDescription.colorAttachments[0].view = gpu.context.getCurrentTexture().createView();
            const commandEncoder = device.createCommandEncoder();
            const renderPass = commandEncoder.beginRenderPass(renderPassDescription as GPURenderPassDescriptor);
            renderPass.setPipeline(pipeline);

            renderPass.setVertexBuffer(0, vertexBuffer);
            renderPass.setVertexBuffer(1, colorBuffer);

            //draw first cube
            renderPass.setBindGroup(0, sceneUniformBindGroup1);
            renderPass.draw(numberOfVertices, 1, 0, 0);

            //draw second cube
            renderPass.setBindGroup(0, sceneUniformBindGroup2);
            renderPass.draw(numberOfVertices, 1, 0, 0);

            renderPass.endPass();
            device.queue.submit([commandEncoder.finish()]);
        }

        T3D.CreateAnimation(draw, [0,0,0], false);  
    } 
}

Ch13TowObjects.CreateObjects();
