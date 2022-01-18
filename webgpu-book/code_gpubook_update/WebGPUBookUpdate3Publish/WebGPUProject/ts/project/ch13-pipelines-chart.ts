import { mat4, vec3 } from 'gl-matrix';
import $ from 'jquery';
import { Transforms as T3D } from '../common/transforms'
import { Surfaces } from '../common/surfaces';
import { MathFunc } from '../common/math-func'
import { Colormaps } from '../common/colormaps';
import { Ch09Shaders, Ch13Shaders } from '../common/shaders';
const createCamera = require('3d-view-controls');

export class Ch13Chart {
    public static isAnimation  = true;    
    public static colormapName = 'jet';
    public static surfaceCenter:vec3 = [0,0,0];
    public static wireframeColor = '1.0,0.0,0.0';
    public static wireframeCenter:vec3 = [0,0,0];

    static async CreateChart() {
        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;

        //get input parameters
        let val = $('#id-surface-center').val();
        Ch13Chart.surfaceCenter = val?.toString().split(',').map(Number) as vec3;
        val = $('#id-wireframe-center').val();
        Ch13Chart.wireframeCenter = val?.toString().split(',').map(Number) as vec3;
        val = $('#id-wireframe-color').val();
        Ch13Chart.wireframeColor = val as string;

        //create vertices for surface
        let data = Surfaces.SimpleSurfaceData(MathFunc.Sinc, -8, 8, -1, 1, -8, 8, 30, 30, 2, this.surfaceCenter);        
        let colorData  = Colormaps.CreateColorData(data?.vertexData as Float32Array, Ch13Chart.colormapName, 'y');
        const vertexBuffer = T3D.CreateGPUBuffer(device, data?.vertexData as Float32Array);       
        const colorBuffer = T3D.CreateGPUBuffer(device, colorData);
        const normalBuffer = T3D.CreateGPUBuffer(device, data?.normalData as Float32Array);

        //create vertices for wirefrom
        let wireframeData = Surfaces.SimpleMeshData(MathFunc.Sinc, -8, 8, -1, 1, -8, 8, 30, 30, 2, this.wireframeCenter);
        const wireframeBuffer = T3D.CreateGPUBuffer(device, wireframeData as Float32Array);

        //uniform data
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
                    buffer:{
                        type:'uniform'
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer:{
                        type:'uniform'
                    }
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
       
        //create render pipeline for surface
        const shader = Ch09Shaders.wgslShaders();
        const pipeline1 = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [sceneUniformBindGroupLayout]
            }),
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
                        arrayStride: 12,
                        attributes: [{
                            shaderLocation: 2,
                            format: "float32x3",
                            offset: 0
                        }]
                    }
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
            },
        });

        //create render pipeline for wireframe
        const shader2 = Ch13Shaders.wgslShaders(this.wireframeColor);
        const pipeline2 = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [sceneUniformBindGroupLayout]
            }),
            vertex: {
                module: device.createShaderModule({
                    code: shader2.vertex
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
                    code: shader2.fragment                 
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
            if(!Ch13Chart.isAnimation){
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
            renderPass.setBindGroup(0, sceneUniformBindGroup);

            //draw surface
            renderPass.setPipeline(pipeline1);
            renderPass.setVertexBuffer(0, vertexBuffer);
            renderPass.setVertexBuffer(1, normalBuffer);
            renderPass.setVertexBuffer(2, colorBuffer);           
            renderPass.draw((data?.vertexData as Float32Array).length/3, 1, 0, 0);

            //draw wireframe
            renderPass.setPipeline(pipeline2);
            renderPass.setVertexBuffer(0, wireframeBuffer);
            //renderPass.setBindGroup(0, sceneUniformBindGroup);
            renderPass.draw((wireframeData as Float32Array).length/3, 1, 0, 0);

            renderPass.endPass();
            device.queue.submit([commandEncoder.finish()]);
        }

        T3D.CreateAnimation(draw, rotation, this.isAnimation);  
    } 
}

Ch13Chart.CreateChart();
$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') Ch13Chart.isAnimation = true;
    else Ch13Chart.isAnimation = false;
    Ch13Chart.CreateChart();
});

$('#id-colormap').on('change',function(){
    const ele = this as any;
    Ch13Chart.colormapName = ele.options[ele.selectedIndex].text;
    Ch13Chart.CreateChart();
});

$('#btn-redraw').on('click', function(){  
    Ch13Chart.CreateChart();
});
