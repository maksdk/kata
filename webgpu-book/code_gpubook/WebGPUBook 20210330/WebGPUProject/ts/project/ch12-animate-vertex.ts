import { mat4, vec2 } from 'gl-matrix';
import $ from 'jquery';
import { Transforms as T3D } from '../common/transforms'
import { Ch06Shaders } from '../common/shaders';
const createCamera = require('3d-view-controls');
import { ComplexFunc } from '../common/complex-func';

export class Ch12 { 
    public static chartType = 'magnitude';
    public static colormapName = 'hsv';
    public static paramRange = [0, 2];
  
    static async CreateSurface() {
        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;
      
        //create vertices        
        const fz = $('#id-zfunc').val()?.toString() as string;
        const xzrange = $('#id-xzrange').val()?.toString().split(',').map(Number) as number[];
        const xzpoints = $('#id-xzpoints').val()?.toString().split(',').map(Number) as number[];
        const scaling = $('#id-scale').val()?.toString().split(',').map(Number) as number[];
        this.paramRange = $('#id-param-range').val()?.toString().split(',').map(Number) as number[];
        const speed = parseFloat($('#id-speed').val() as string);
        this.paramRange = this.paramRange.map(x=>x*scaling[0]);
        let param = vec2.fromValues(this.paramRange[1], 0);

        let data = ComplexFunc.ComplexSurfaceData1(fz, this.chartType, xzrange[0],xzrange[1],xzrange[2], xzrange[3],
            xzpoints[0],xzpoints[1], scaling, this.colormapName,param[0]);

        let vertexBuffer = T3D.CreateGPUBuffer(device, data?.vertexData as Float32Array);       
        let colorBuffer = T3D.CreateGPUBuffer(device, data?.colorData as Float32Array);

        //uniform data
        T3D.CameraPosition = [2, 2, 4];
        const modelMatrix = mat4.create();
        const mvpMatrix = mat4.create();
        let vMatrix = mat4.create();
        let vpMatrix = mat4.create();
        const vp = T3D.CreateViewProjection(true, gpu.canvas.width/gpu.canvas.height);       
        vpMatrix = vp.viewProjectionMatrix;    
          
        let camera = createCamera(gpu.canvas, vp.cameraOption);
        
        //create uniform buffer and layout
        const vertexUniformBuffer = device.createBuffer({
            size: 64,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const sceneUniformBindGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
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
                }          
            ]
        });
       
        //create render pipeline
        const pipeline = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [sceneUniformBindGroupLayout]
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
            if(camera.tick()){
                const pMatrix = vp.projectionMatrix;
                vMatrix = camera.matrix;
                mat4.multiply(vpMatrix, pMatrix, vMatrix);
            }
            
            data = ComplexFunc.ComplexSurfaceData1(fz, Ch12.chartType, xzrange[0],xzrange[1],xzrange[2], xzrange[3],
                xzpoints[0],xzpoints[1], scaling, Ch12.colormapName,param[0]);    
            vertexBuffer = T3D.CreateGPUBuffer(device, data?.vertexData as Float32Array);       
            colorBuffer = T3D.CreateGPUBuffer(device, data?.colorData as Float32Array);            
            
            T3D.CreateTransforms(modelMatrix,[0,0,0], [0,0,0], [1,1,1]);
            mat4.multiply(mvpMatrix, vpMatrix, modelMatrix);
            device.queue.writeBuffer(vertexUniformBuffer, 0, mvpMatrix as ArrayBuffer);

            renderPassDescription.colorAttachments[0].attachment = gpu.swapChain.getCurrentTexture().createView();
            const commandEncoder = device.createCommandEncoder();
            const renderPass = commandEncoder.beginRenderPass(renderPassDescription as GPURenderPassDescriptor);

            renderPass.setPipeline(pipeline);
            renderPass.setVertexBuffer(0, vertexBuffer);
            renderPass.setVertexBuffer(1, colorBuffer);
            renderPass.setBindGroup(0, sceneUniformBindGroup);
            renderPass.draw((data?.vertexData as Float32Array).length/3, 1, 0, 0);
            renderPass.endPass();
            device.queue.submit([commandEncoder.finish()]);

            $('#id-res').html(`parameter a = ${(param[0]/scaling[0]).toFixed(2)}`);
        }

        T3D.animateVertex(draw, param, this.paramRange, speed);  
    } 
}

Ch12.CreateSurface();

$('#id-charttype').on('change',function(){
    const ele = this as any;
    Ch12.chartType = ele.options[ele.selectedIndex].text;
    Ch12.CreateSurface();
});

$('#id-select').on('change',function(){
    const ele = this as any;
    Ch12.colormapName = ele.options[ele.selectedIndex].text;
    Ch12.CreateSurface();
});

$('#btn-redraw').on('click', function(){
    Ch12.CreateSurface();
});

