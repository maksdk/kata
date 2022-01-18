import { mat4, vec3 } from 'gl-matrix';
import $ from 'jquery';
import { Transforms as T3D } from '../common/transforms';
import { ShapeData } from '../common/shape-data';
import { Ch06Shaders } from '../common/shaders';
const createCamera = require('3d-view-controls');

export class Ch06Cube {
    public static isAnimation = true;
    public static isPerspective = true;

    static async CreateCube() {
        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;

        //create vertices
        const cubeVertexSize = 4 * 8; // Byte size of one cube vertex.
        const cubeColorOffset = 4 * 3; // Byte offset of cube vertex color attribute.
        const cubeData = ShapeData.CubeData1();        
        const vertexBuffer = T3D.CreateGPUBuffer(device, cubeData);
       
        //create uniform data       
        const modelMatrix = mat4.create();
        const mvpMatrix = mat4.create();
        let vMatrix = mat4.create();
        let vpMatrix = mat4.create();
        const vp = T3D.CreateViewProjection(this.isPerspective, gpu.canvas.width/gpu.canvas.height);       
        vpMatrix = vp.viewProjectionMatrix;    

        let rotation = vec3.fromValues(0, 0, 0);       
        var camera = createCamera(gpu.canvas, vp.cameraOption);
 
        //create render pipeline
        const pipeline = device.createRenderPipeline({
            vertex: {
                module: device.createShaderModule({
                    code: Ch06Shaders.wgslShaders.vertex                   
                }),
                entryPoint: "main",
                buffers: [
                    {
                        arrayStride: cubeVertexSize,
                        attributes: [
                            {
                              // position
                              shaderLocation: 0,
                              offset: 0,
                              format: 'float32x3',
                            },
                            {
                              // color
                              shaderLocation: 1,
                              offset: cubeColorOffset,
                              format: 'float32x3',
                            },
                        ],
                    }
                ]
            },
            fragment: {
                module: device.createShaderModule({
                    code: Ch06Shaders.wgslShaders.fragment                 
                }),
                entryPoint: "main",
                targets: [{
                    format: gpu.format as GPUTextureFormat
                }]
            },
            primitive: {
                topology: "triangle-list",
                cullMode : 'back'
            },
            depthStencil: {
                format: "depth24plus-stencil8",
                depthWriteEnabled: true,
                depthCompare: "less"
            },
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

        //render pass
        const depthTexture = device.createTexture({
            size: [gpu.canvas.width, gpu.canvas.height, 1],
            format: "depth24plus-stencil8",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });

        const renderPassDescription = {
            colorAttachments: [{
                view: gpu.context.getCurrentTexture().createView(),
                loadValue: [0.5, 0.5, 0.8, 1],
                StoreOp: 'store'
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
            if(!Ch06Cube.isAnimation){
                if(camera.tick()){
                    const pMatrix = vp.projectionMatrix;
                    vMatrix = camera.matrix;
                    mat4.multiply(vpMatrix, pMatrix, vMatrix);
                }
            }
            T3D.CreateTransforms(modelMatrix,[0,0,0], rotation, [1,1,1]);
            mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);
            device.queue.writeBuffer(sceneUniformBuffer, 0, mvpMatrix as ArrayBuffer);

            renderPassDescription.colorAttachments[0].view = gpu.context.getCurrentTexture().createView();
            const commandEncoder = device.createCommandEncoder();
            const renderPass = commandEncoder.beginRenderPass(renderPassDescription as GPURenderPassDescriptor);
            renderPass.setPipeline(pipeline);

            renderPass.setVertexBuffer(0, vertexBuffer);          
            renderPass.setBindGroup(0, sceneUniformBindGroup);
            renderPass.draw(36, 1, 0, 0);
            renderPass.endPass();
            device.queue.submit([commandEncoder.finish()]);
        }

        T3D.CreateAnimation(draw, rotation, this.isAnimation);  
    } 
}

Ch06Cube.CreateCube();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') Ch06Cube.isAnimation = true;
    else Ch06Cube.isAnimation = false;
    Ch06Cube.CreateCube();
});

$('#id-projection input:radio').on('click', function(){
    let val = $('input[name="projections"]:checked').val();
    if(val === 'orthographic') Ch06Cube.isPerspective = false;
    else Ch06Cube.isPerspective = true;
    Ch06Cube.CreateCube();
});
