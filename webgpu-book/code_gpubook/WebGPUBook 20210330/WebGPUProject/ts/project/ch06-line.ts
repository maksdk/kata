import { mat4, vec3 } from 'gl-matrix';
import $ from 'jquery';
import { Transforms as T3D } from '../common/transforms';
import { Ch06Shaders } from '../common/shaders';
const createCamera = require('3d-view-controls');

export class Ch06Line {
    public static isAnimation = true;
    public static isPerspective = true;

    private static createLine3DData(){
        let data =[] as any;
        for(let i = 0; i < 300; i++){
            let t = 0.1*i/30;
            let x = Math.exp(-t)*Math.sin(30*t);
            let z = Math.exp(-t)*Math.cos(30*t);
            let y = 2*t-1;
            data.push(x, y, z);
        }
        return new Float32Array(data.flat(1));
    }
    
    static async CreateLine() {
        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;

        //create vertices
        const lineData = this.createLine3DData();        
        const vertexBuffer = T3D.CreateGPUBuffer(device, lineData);       

        //create uniform data       
        const modelMatrix = mat4.create();
        const mvpMatrix = mat4.create();
        let vMatrix = mat4.create();
        let vpMatrix = mat4.create();
        const vp = T3D.CreateViewProjection(this.isPerspective, gpu.canvas.width/gpu.canvas.height);       
        vpMatrix = vp.viewProjectionMatrix;    
           
        let rotation = vec3.fromValues(0, 0, 0);       
        var camera = createCamera(gpu.canvas, vp.cameraOption);

        //create uniform buffer and layout
        const sceneUniformBuffer = device.createBuffer({
            size: 64,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const sceneUniformBindGroupLayout = device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                type: "uniform-buffer"
            }]
        });

        const sceneUniformBindGroup = device.createBindGroup({
            layout: sceneUniformBindGroupLayout,
            entries: [{
                binding: 0,
                resource: {
                    buffer: sceneUniformBuffer
                }
            }]
        });

        //create render pipeline
        const pipeline = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [sceneUniformBindGroupLayout]
            }),
            vertexStage: {
                module: device.createShaderModule({
                    code: Ch06Shaders.wgslShadersLine.vertex                   
                }),
                entryPoint: "main"
            },
            fragmentStage: {
                module: device.createShaderModule({
                    code: Ch06Shaders.wgslShadersLine.fragment               
                }),
                entryPoint: "main"
            },
            primitiveTopology: "line-strip",           
            vertexState: {
                vertexBuffers: [
                    {
                        arrayStride: 12,
                        attributes: [{
                            shaderLocation: 0,
                            format: "float3",
                            offset: 0
                        }]
                    }
                ],
                indexFormat: "uint32"
            },
            colorStates: [{
                format: gpu.swapChainFormat as GPUTextureFormat
            }]
        });

        function draw() {
            if(!Ch06Line.isAnimation){
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
                    attachment: gpu.swapChain.getCurrentTexture().createView(),
                    loadValue: [0.5, 0.5, 0.8, 1]
                }]
            });
            renderPass.setPipeline(pipeline);
            renderPass.setVertexBuffer(0, vertexBuffer);
            renderPass.setBindGroup(0, sceneUniformBindGroup);
            renderPass.draw(300, 1, 0, 0);
            renderPass.endPass();
            device.queue.submit([commandEncoder.finish()]);
        }       
        
        T3D.CreateAnimation(draw, rotation, this.isAnimation);  
    } 
}

Ch06Line.CreateLine();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') Ch06Line.isAnimation = true;
    else Ch06Line.isAnimation = false;
    Ch06Line.CreateLine();
});

$('#id-projection input:radio').on('click', function(){
    let val = $('input[name="projections"]:checked').val();
    if(val === 'orthographic') Ch06Line.isPerspective = false;
    else Ch06Line.isPerspective = true;
    Ch06Line.CreateLine();
});
