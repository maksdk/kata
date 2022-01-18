import { Transforms as T3D } from '../common/transforms';
import { Ch14Shaders } from '../common/shaders';
import $ from 'jquery';

export class Ch14Particles {
  static numParticles: number = 1500;
  static particleSize: number = 1.0;
  static colorScale: string = '0.1';

  static async CreateParticles() {
    const gpu = await T3D.InitWebGPU();
    const device = gpu.device;

    //get input parameters
    let val = $('#id-num').val();
    this.numParticles = parseInt(val as string);
    val = $('#id-size').val();
    this.particleSize = parseFloat(val as string);
    this.colorScale = $('#id-color').val() as string;

    //create vertex buffer
    const vertexData = new Float32Array([
      -0.01 * this.particleSize, -0.02 * this.particleSize,
      0.01 * this.particleSize, -0.02 * this.particleSize,
      0.00 * this.particleSize, 0.02 * this.particleSize
    ]);
    const vertexBuffer = T3D.CreateGPUBuffer(device, vertexData);

    //create parameter buffer
    const paramData = new Float32Array([
      0.04,       // deltaT;
      0.1,        // rule1Distance;
      0.025,      // rule2Distance;
      0.025,      // rule3Distance;
      0.02,       // rule1Scale;
      0.05,       // rule2Scale;
      0.005,      // rule3Scale;
    ])
    
    const paramBuffer = T3D.CreateGPUBuffer(device, paramData, GPUBufferUsage.UNIFORM);

    const initialParticleData = new Float32Array(this.numParticles * 4);
    for (let i = 0; i < this.numParticles; ++i) {
      initialParticleData[4 * i + 0] = 2 * (Math.random() - 0.5);
      initialParticleData[4 * i + 1] = 2 * (Math.random() - 0.5);
      initialParticleData[4 * i + 2] = 2 * (Math.random() - 0.5) * 0.1;
      initialParticleData[4 * i + 3] = 2 * (Math.random() - 0.5) * 0.1;
    }

    const particleBuffers: GPUBuffer[] = new Array(2);

    for (let i = 0; i < 2; i++) {
      particleBuffers[i] = T3D.CreateGPUBuffer(device, initialParticleData, GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE);
    }
    const particleBindGroups: GPUBindGroup[] = new Array(2);
    const shaders = Ch14Shaders.wgslShaders(this.numParticles, this.colorScale);
    const computePipeline = device.createComputePipeline({
      compute: {
        module: device.createShaderModule({
          code: shaders.compute
        }),
        entryPoint: 'main',
      },
    });

    for (let i = 0; i < 2; ++i) {
      particleBindGroups[i] = device.createBindGroup({
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: {
              buffer: paramBuffer,
              offset: 0,
              size: paramData.byteLength,
            },
          },
          {
            binding: 1,
            resource: {
              buffer: particleBuffers[i],
              offset: 0,
              size: initialParticleData.byteLength,
            },
          },
          {
            binding: 2,
            resource: {
              buffer: particleBuffers[(i + 1) % 2],
              offset: 0,
              size: initialParticleData.byteLength,
            },
          },
        ],
      });
    }

    const renderPipeline = device.createRenderPipeline({
      vertex: {
        module: device.createShaderModule({
          code: shaders.vertex
        }),
        entryPoint: 'main',
        buffers: [
          {
            // instanced particles buffer
            arrayStride: 4 * 4,
            stepMode: 'instance',
            attributes: [
              {
                // instance position
                shaderLocation: 0,
                offset: 0,
                format: 'float32x2',
              },
              {
                // instance velocity
                shaderLocation: 1,
                offset: 2 * 4,
                format: 'float32x2',
              },
            ],
          },
          {
            // vertex buffer
            arrayStride: 2 * 4,
            stepMode: 'vertex',
            attributes: [
              {
                // vertex positions
                shaderLocation: 2,
                offset: 0,
                format: 'float32x2',
              },
            ],
          },
        ],
      },
      fragment: {
        module: device.createShaderModule({
          code: shaders.fragment
        }),
        entryPoint: 'main',
        targets: [
          {
              format: 'bgra8unorm'
          }
        ]
      },

      primitive: {
        topology: 'triangle-list'
      },
    });

    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: gpu.context.getCurrentTexture().createView(), // Assigned later
          loadValue: [0.5, 0.5, 0.8, 1],
          storeOp: 'store'
        },
      ]
    };

    let t = 0;
    function draw() {
      renderPassDescriptor.colorAttachments[0].view = gpu.context.getCurrentTexture().createView();
      const commandEncoder = device.createCommandEncoder();

      {   //compute pass
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(computePipeline);
        passEncoder.setBindGroup(0, particleBindGroups[t % 2]);
        passEncoder.dispatch(Ch14Particles.numParticles);
        passEncoder.endPass();
      }
      {   //render pass
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor as GPURenderPassDescriptor);
        passEncoder.setPipeline(renderPipeline);
        passEncoder.setVertexBuffer(0, particleBuffers[(t + 1) % 2]);
        passEncoder.setVertexBuffer(1, vertexBuffer);
        passEncoder.draw(3, Ch14Particles.numParticles, 0, 0);
        passEncoder.endPass();
      }

      device.queue.submit([commandEncoder.finish()]);

      ++t;
    };
    T3D.CreateAnimation(draw, [0, 0, 0], false);
  }
}

Ch14Particles.CreateParticles();
$('#btn-redraw').on('click', function () {
  Ch14Particles.CreateParticles();
});
