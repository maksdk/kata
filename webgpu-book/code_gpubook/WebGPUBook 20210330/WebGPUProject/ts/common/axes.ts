import { vec3 } from 'gl-matrix';
import { Transforms as T3D } from './transforms';
import { Ch13Shaders } from './shaders';

export class Axes {
    public static size:vec3 = [1,1,1];
    public static center:vec3 = [0,0,0];  
    public static xcolor:vec3 = [1,0,0];
    public static ycolor:vec3 = [0,1,0];
    public static zcolor:vec3 = [0,0,1];
    public static depthStencilFormat:GPUTextureFormat = 'depth24plus';
    public static sceneUniformBindGroupLayout:GPUBindGroupLayout;
    public static pipeline:GPURenderPipeline;
    public static vertexBuffer:GPUBuffer;
    public static colorBuffer:GPUBuffer;
        
    static async InitAxes(gpu:any) {
        const device = await gpu.device;

        //create vertices and colors
        const vertices = new Float32Array([
           this.center[0], this.center[1], this.center[2], this.center[0] + this.size[0], this.center[1], this.center[2],
           this.center[0], this.center[1], this.center[2], this.center[0], this.center[1] + this.size[1], this.center[2],
           this.center[0], this.center[1], this.center[2], this.center[0], this.center[1], this.center[2] + this.size[2]
        ]);
        const colors = new Float32Array([
            this.xcolor[0], this.xcolor[1], this.xcolor[2],this.xcolor[0], this.xcolor[1], this.xcolor[2],
            this.ycolor[0], this.ycolor[1], this.ycolor[2],this.ycolor[0], this.ycolor[1], this.ycolor[2],
            this.zcolor[0], this.zcolor[1], this.zcolor[2],this.zcolor[0], this.zcolor[1], this.zcolor[2]
        ]);

        this.vertexBuffer = T3D.CreateGPUBuffer(device, vertices);
        this.colorBuffer = T3D.CreateGPUBuffer(device, colors);

        //create render pipeline
        const shader = Ch13Shaders.wgslShadersAxes();
        this.pipeline = device.createRenderPipeline({
            layout: device.createPipelineLayout({
                bindGroupLayouts: [this.sceneUniformBindGroupLayout]
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
            primitiveTopology: "line-list",
            depthStencilState: {
                format: this.depthStencilFormat,
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
                format: gpu.swapChainFormat as GPUTextureFormat
            }]
        });
    } 

    public static CreateAxes(renderPass: GPURenderPassEncoder) {
        renderPass.setPipeline(this.pipeline);
        renderPass.setVertexBuffer(0, this.vertexBuffer);
        renderPass.setVertexBuffer(1, this.colorBuffer);        
        renderPass.draw(6, 1, 0, 0);
    }
}

