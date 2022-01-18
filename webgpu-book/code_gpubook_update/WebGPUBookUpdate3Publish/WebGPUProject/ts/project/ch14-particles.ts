import { Transforms as T3D } from '../common/transforms';
import { Ch14Shaders } from '../common/shaders';
import $ from 'jquery';
import { vec3 } from 'gl-matrix';

export class Ch14Particles {
    static numParticles: number = 50000;
    static particleSize: number = 5;
    static massFactors:vec3 = [2.0, 2.0, 2.0];
    static colorOpacity: number = 0.5;

    static async CreateParticles() {
        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;
      
        //get input parameters
        let val = $('#id-num').val();
        Ch14Particles.numParticles = parseInt(val as string);
        val = $('#id-size').val();
        Ch14Particles.particleSize = parseFloat(val as string);
        val = $('#id-mass').val();
        Ch14Particles.massFactors = (val as string).split(',').map(Number) as vec3;
        val = $('#id-color').val();
        Ch14Particles.colorOpacity = parseFloat(val as string);

        // create vertex, color buffers
        const vertexData = new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
             1,  1
        ]);
        const vertexBuffer = T3D.CreateGPUBuffer(device, vertexData);

        const colorData = new Float32Array(4 * this.numParticles);
        for (let i = 0; i < colorData.length; i += 4) {
            colorData[i] = Math.random();
            colorData[i + 1] = Math.random();
            colorData[i + 2] = Math.random();
            colorData[i + 3] = this.colorOpacity;
        }
        const colorBuffer = T3D.CreateGPUBuffer(device, colorData);

        //create position, velocity buffers
        const positionData = new Float32Array(4 * this.numParticles);
        for (let i = 0; i < positionData.length; i += 4) {
            positionData[i] = Math.random() * 2 - 1;
            positionData[i + 1] = Math.random() * 2 - 1;
            positionData[i + 2] = Math.random() * 2 - 1;
            positionData[i + 3] = 1;
        }
        const bufferUsage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE;
        const positionBufferA = T3D.CreateGPUBuffer(device, positionData, bufferUsage);

        const velocityData = new Float32Array(4 * this.numParticles);
        for (let i = 0; i < velocityData.length; i += 4) {
            velocityData[i] = Math.random() * 0.002 - 0.001;
            velocityData[i + 1] = Math.random() * 0.002 - 0.001;
            velocityData[i + 2] = 0;
            velocityData[i + 3] = 1;
        }
        const velocityBufferA = T3D.CreateGPUBuffer(device, velocityData, bufferUsage);

        const positionBufferB = device.createBuffer({
            size: 16 * this.numParticles,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE
        });

        const velocityBufferB = device.createBuffer({
            size: 16 * this.numParticles,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE
        });

        //create compute uniform buffer
        const computeData = new Float32Array([
            Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, 0, 1.0,          //mass 1 position
            Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, 0, 1.0,          //mass 2 position
            Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, 0, 1.0,          //mass 3 position
            Math.random() * this.massFactors[0]/this.numParticles,                 //mass 1 factor
            Math.random() * this.massFactors[1]/this.numParticles,                 //mass 2 factor
            Math.random() * this.massFactors[2]/this.numParticles                  //mass 3 factor
        ]);
        //const computeBuffer = T3D.CreateGPUBuffer(device, computeData, GPUBufferUsage.UNIFORM | GPUBufferUsage.STORAGE);
        const computeBuffer = T3D.CreateGPUBuffer(device, computeData, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);

        const computeBindGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: 'storage'
                    }
                    //type: "storage-buffer"
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: 'storage'
                    }
                    //type: "storage-buffer"
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: 'storage'
                    }
                    //type: "storage-buffer"
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: 'storage'
                    }
                    //type: "storage-buffer"
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: 'uniform'
                    }
                    //type: "uniform-buffer"
                }
            ]
        });

        const computeBindGroupA2B = device.createBindGroup({
            layout: computeBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: positionBufferA
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: velocityBufferA
                    }
                },
                {
                    binding: 2,
                    resource: {
                        buffer: positionBufferB
                    }
                },
                {
                    binding: 3,
                    resource: {
                        buffer: velocityBufferB
                    }
                },
                {
                    binding: 4,
                    resource: {
                        buffer: computeBuffer
                    }
                }
            ]
        });

        const computeBindGroupB2A = device.createBindGroup({
            layout: computeBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: positionBufferB
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: velocityBufferB
                    }
                },
                {
                    binding: 2,
                    resource: {
                        buffer: positionBufferA
                    }
                },
                {
                    binding: 3,
                    resource: {
                        buffer: velocityBufferA
                    }
                },
                {
                    binding: 4,
                    resource: {
                        buffer: computeBuffer
                    }
                }
            ]
        });

        // compute pipeline
        const shaders = Ch14Shaders.wgslShaders1(this.numParticles);
        const computePipeline = device.createComputePipeline({
            layout: device.createPipelineLayout({ bindGroupLayouts: [computeBindGroupLayout] }),
            compute: {
                module: device.createShaderModule({
                    code: shaders.compute
                }),
                entryPoint: "main"
            }
        });

        //uniform buffer, binding layout
        const vertexUniformData = new Float32Array([gpu.canvas.width, gpu.canvas.height, this.particleSize]);
        const vertexUniformBuffer = T3D.CreateGPUBuffer(device, vertexUniformData, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST)

        const vertexUniformBindGroupLayout = device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {
                    type: 'uniform'
                }
                //type: "uniform-buffer"
            }]
        });

        const vertexUniformBindGroup = device.createBindGroup({
            layout: vertexUniformBindGroupLayout,
            entries: [{
                binding: 0,
                resource: {
                    buffer: vertexUniformBuffer
                }
            }]
        });

        //create render pipeline
        const renderPipeline = device.createRenderPipeline({
            layout: device.createPipelineLayout({ bindGroupLayouts: [vertexUniformBindGroupLayout] }),
            vertex: {
                module: device.createShaderModule({
                    code: shaders.vertex
                }),
                entryPoint: "main",
                buffers: [
                    {
                        arrayStride: 8,
                        attributes: [{
                            shaderLocation: 0,
                            format: "float32x2",
                            offset: 0
                        }]
                    },
                    {
                        arrayStride: 16,
                        stepMode: "instance",
                        attributes: [{
                            shaderLocation: 1,
                            format: "float32x4",
                            offset: 0
                        }]
                    },
                    {
                        arrayStride: 16,
                        stepMode: "instance",
                        attributes: [{
                            shaderLocation: 2,
                            format: "float32x4",
                            offset: 0
                        }]
                    }
                ],
            },
            fragment: {
                module: device.createShaderModule({
                    code: shaders.fragment
                }),
                entryPoint: "main",
                targets: [
                    {
                        format: gpu.format as GPUTextureFormat,
                        blend:{
                            alpha: {
                                srcFactor: 'one',
                                dstFactor: 'one-minus-src-alpha'
                            },
                            color: {
                                srcFactor: 'one',
                                dstFactor: 'one-minus-src-alpha'
                            }
                        }
                    }
                ]
            },
            primitive: {
                topology: "triangle-strip",
                stripIndexFormat: 'uint32'
            }
        });

        //render pass
        const renderPassDescriptor = {
            colorAttachments: [{
                view: gpu.context.getCurrentTexture().createView(),
                loadValue: [0.5, 0.5, 0.8, 1],
                storeOp: 'store'
            }]
        };

        let currentPositionBuffer = positionBufferB;
        function draw() {
            const currentComputeBindGroup = currentPositionBuffer === positionBufferA ? computeBindGroupB2A : computeBindGroupA2B;
            const commandEncoder = device.createCommandEncoder();
            const computePass = commandEncoder.beginComputePass();
            computePass.setPipeline(computePipeline);
            computePass.setBindGroup(0, currentComputeBindGroup);
            computePass.dispatch(Ch14Particles.numParticles);
            computePass.endPass();

            renderPassDescriptor.colorAttachments[0].view = gpu.context.getCurrentTexture().createView();
            const renderPass = commandEncoder.beginRenderPass(renderPassDescriptor as GPURenderPassDescriptor);
            renderPass.setPipeline(renderPipeline);

            renderPass.setVertexBuffer(0, vertexBuffer);
            renderPass.setVertexBuffer(1, colorBuffer);
            renderPass.setVertexBuffer(2, currentPositionBuffer);
            renderPass.setBindGroup(0, vertexUniformBindGroup);

            renderPass.draw(4, Ch14Particles.numParticles, 0, 0);
            renderPass.endPass();
            device.queue.submit([commandEncoder.finish()]);
            currentPositionBuffer = currentPositionBuffer === positionBufferA ? positionBufferB : positionBufferA;
        }

        T3D.CreateAnimation(draw, [0, 0, 0], false);
    }
}

Ch14Particles.CreateParticles();
$('#btn-redraw').on('click', function(){  
    Ch14Particles.CreateParticles();
});
