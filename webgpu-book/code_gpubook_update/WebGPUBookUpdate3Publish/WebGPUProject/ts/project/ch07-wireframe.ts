import { mat4, vec3 } from 'gl-matrix';
import { Transforms as T3D } from '../common/transforms';
import { Ch06Shaders } from '../common/shaders';
const createCamera = require('3d-view-controls');

export class Ch07Wireframe {
    public static isAnimation  = true;
    public static centerLocation : vec3 = [0,0,0];
    public static meshData : Float32Array;
    
    static async CreateWireframe() {
        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;

        //create vertices
        const vertexBuffer = T3D.CreateGPUBuffer(device, this.meshData);       
   
        //create uniform data       
        const modelMatrix = mat4.create();
        const mvpMatrix = mat4.create();
        let vMatrix = mat4.create();
        let vpMatrix = mat4.create();
        const vp = T3D.CreateViewProjection(true, gpu.canvas.width/gpu.canvas.height);       
        vpMatrix = vp.viewProjectionMatrix;    

        let rotation = vec3.fromValues(0, 0, 0);       
        var camera = createCamera(gpu.canvas, vp.cameraOption);
       
        //create render pipeline
        const pipeline = device.createRenderPipeline({
            vertex: {
                module: device.createShaderModule({
                    code: Ch06Shaders.wgslShadersLine.vertex
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
                    }
                ]
            },
            fragment: {
                module: device.createShaderModule({
                    code: Ch06Shaders.wgslShadersLine.fragment                 
                }),
                entryPoint: "main",
                targets: [
                    {
                        format: gpu.format as GPUTextureFormat
                    }
                ]
            },
            primitive: {
                topology: "line-list"
            }           
        });

        //create uniform buffer and bind group
        const sceneUniformBuffer = device.createBuffer({
            size: 64,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const sceneUniformBindGroup = device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: {
                    buffer: sceneUniformBuffer,
                    offset: 0,
                    size: 64
                }
            }]
        });

        function draw() {
            if(!Ch07Wireframe.isAnimation){
                if(camera.tick()){
                    const pMatrix = vp.projectionMatrix;
                    vMatrix = camera.matrix;
                    mat4.multiply(vpMatrix, pMatrix, vMatrix);
                }
            }
            T3D.CreateTransforms(modelMatrix,[0,0,0], rotation, [1,1,1]);
            mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);
            device.queue.writeBuffer(sceneUniformBuffer, 0, mvpMatrix as ArrayBuffer);

            const commandEncoder = device.createCommandEncoder();
            const renderPass = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: gpu.context.getCurrentTexture().createView(),
                    loadValue: [0.5, 0.5, 0.8, 1],
                    storeOp: 'store'
                }]
            });
            renderPass.setPipeline(pipeline);
            renderPass.setVertexBuffer(0, vertexBuffer);
            renderPass.setBindGroup(0, sceneUniformBindGroup);
            renderPass.draw(Ch07Wireframe.meshData.length/3, 1, 0, 0);
            renderPass.endPass();
            device.queue.submit([commandEncoder.finish()]);
        }

        T3D.CreateAnimation(draw, rotation, this.isAnimation);  
    } 
}

