import { mat4, vec3 } from 'gl-matrix';
import { Transforms as T3D } from '../common/transforms';
import { Ch12Shaders } from '../common/shaders';
import $ from 'jquery';

export class Ch12Fractal {
    public static maxIterations = 10;
    static async CreateFractal() {
        const startTime = performance.now();

        this.maxIterations = parseInt($('#id-iterations').val() as string);

        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;
        
        //create vertices
        const data = this.createVertexData();
        const vertexBuffer = T3D.CreateGPUBuffer(device, data.vertices);       
        const uvBuffer = T3D.CreateGPUBuffer(device, data.uvs);

        //uniform data
        T3D.CameraPosition=[0,0,1]
        const modelMatrix = mat4.create();
        const vp = T3D.CreateViewProjection(true, gpu.canvas.width/gpu.canvas.height);       
        T3D.CreateTransforms(modelMatrix,[0,0,0], [0,0,0] as vec3, [1,1,1]);
                
        //create render pipeline
        const shader = Ch12Shaders.wgslShaders();
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
                        arrayStride: 8,
                        attributes: [{
                            shaderLocation: 1,
                            format: "float32x2",
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
            }
        });

          //create uniform buffer and layout
          const vertexUniformBuffer = device.createBuffer({
            size: 128,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        
        device.queue.writeBuffer(vertexUniformBuffer, 0, vp.viewProjectionMatrix as ArrayBuffer);
        device.queue.writeBuffer(vertexUniformBuffer, 64, modelMatrix as ArrayBuffer);
    
        //get texture and sampler data
        let ts = this.createTexture(device, this.maxIterations);
        const sceneUniformBindGroup = device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: vertexUniformBuffer
                    }
                },                
                {
                    binding: 1,
                    resource: ts.sampler
                },
                {
                    binding: 2,
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

        renderPassDescription.colorAttachments[0].view = gpu.context.getCurrentTexture().createView();
        const commandEncoder = device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescription as any);

        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setVertexBuffer(1, uvBuffer);

        renderPass.setBindGroup(0, sceneUniformBindGroup);
        renderPass.draw(data.vertices.length/3, 1, 0, 0);
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

        const uvs = new Float32Array([
            0,0, 0,1, 1,1,
            1,1, 1,0, 0,0
        ]);

        return {
            vertices,
            uvs,
        }
    }

    private static createTextureImage(maxIterations = 10):Uint8Array {
        const max = maxIterations;
        const height = 3.0;
        const width = 3.0;
        const cx = -0.5;
        const cy = 0.0;
        const n = 512;
        const m = 512;
        const image = new Uint8Array(4*m*n);

        let res = 0;
        for(let i=0;i<n;i++){
            for(let j=0;j<m;j++){
                var x = j * width /( m - 1) + cx - width / 2;
                var y = i * height/(n - 1)  + cy - height / 2;               

	            var z = [ 0.0, 0.0 ];
	            var c =  [ x, y ];

                for ( let k = 0; k < max; k++ ) {
                    // compute z = z^2 + c
                    z = [z[0]*z[0]-z[1]*z[1], 2*z[0]*z[1]];
                    z = [z[0]+c[0],  z[1]+c[1]];
                    res = Math.sqrt(z[0]*z[0]+z[1]*z[1]);        
                    if ( res > 4.0 ) break; 
                }
                if ( res > 1.0 ) res = 1.0;     

                image[4*i*m+4*j]   = 255*res;
                image[4*i*m+4*j+1] = 255*(0.5 * (Math.sin(3.0*res*Math.PI) + 1.0));
                image[4*i*m+4*j+2] = 255*(0.5 * (Math.cos(3.0*res*Math.PI) + 1.0));
                image[4*i*m+4*j+3] = 255;
            }
        }       
        return image;
    }

    private static createTexture(device:GPUDevice, maxIterations = 10){
        const sampler = device.createSampler({
            minFilter: "linear",
            magFilter: "linear"
        });

        const imgWidth = 512;
        const imgHeight = 512;

        const texture = device.createTexture({
            size: [imgWidth,imgHeight,1],
            format: "rgba8unorm",
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        });
    
        const textureData = this.createTextureImage(maxIterations);
        device.queue.writeTexture(
            { texture },
            textureData,
            { bytesPerRow: imgWidth * 4 },
            [
                imgWidth, 
                imgHeight, 
                1
            ]
        );
       
        return{
            texture,
            sampler
        }
    }
}

Ch12Fractal.CreateFractal();

$('#btn-redraw').on('click', function(){
    Ch12Fractal.CreateFractal();
});
