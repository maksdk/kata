import { mat4, vec3 } from 'gl-matrix';
import { Transforms as T3D } from '../common/transforms';
import { Ch12Shaders } from '../common/shaders';
import $ from 'jquery';

export class Ch12Fractal {
    public static maxIterations = '10';
    public static scale = '0.4';
    public static cx = '-0.8';
    public static cy = '0.1';
    
    static async CreateFractal() {
        const startTime = performance.now();

        this.maxIterations = $('#id-iterations').val() as string;
        this.scale = $('#id-scale').val() as string;
        this.cx = $('#id-cx').val() as string;
        this.cy = $('#id-cy').val() as string;

        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;
        
        //create vertices
        const data = this.createVertexData();
        const vertexBuffer = T3D.CreateGPUBuffer(device, data);       

        //uniform data
        T3D.CameraPosition=[0,0,1]
        const modelMatrix = mat4.create();
        const vp = T3D.CreateViewProjection(true, gpu.canvas.width/gpu.canvas.height);       
        T3D.CreateTransforms(modelMatrix,[0,0,0], [0,0,0] as vec3, [1,1,1]);
         
        //create uniform buffer and layout
        const vertexUniformBuffer = device.createBuffer({
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        
        device.queue.writeBuffer(vertexUniformBuffer, 0, vp.viewProjectionMatrix as ArrayBuffer);
        device.queue.writeBuffer(vertexUniformBuffer, 64, modelMatrix as ArrayBuffer);
     
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
        const shader = Ch12Shaders.wgslShaders1(this.maxIterations, this.scale, this.cx, this.cy);
        const pipeline = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [sceneUniformBindGroupLayout]
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

        renderPassDescription.colorAttachments[0].attachment = gpu.swapChain.getCurrentTexture().createView();
        const commandEncoder = device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescription as GPURenderPassDescriptor);

        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
       
        renderPass.setBindGroup(0, sceneUniformBindGroup);
        renderPass.draw(data.length/3, 1, 0, 0);
        renderPass.endPass();
        device.queue.submit([commandEncoder.finish()]);

        const duration = performance.now() - startTime;
        $('#id-perf').html('time to run the program: ' + duration.toFixed(0)+ ' milliseconds');
    } 

    private static createVertexData(){
        const vertices = new Float32Array([
            -1,-1,0, -1,1,0, 1,1,0,
            1,1,0, 1,-1,0, -1,-1,0
        ]);

        return vertices
    }
}

Ch12Fractal.CreateFractal();

$('#btn-redraw').on('click', function(){
    Ch12Fractal.CreateFractal();
});

$('#btn-reset').on('click', function(){
    $('#id-maxIterations').val('20');
    $('#id-scale').val('0.4');
    $('#id-cx').val('0.8');
    $('#id-cy').val('0.1');
    Ch12Fractal.CreateFractal();
});

