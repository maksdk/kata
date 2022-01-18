import { Transforms as T3D } from '../common/transforms';
import { Ch14Shaders } from '../common/shaders';
import $ from 'jquery';
import { vec2 } from 'gl-matrix';

export class Ch14Compute {
  public static p0:vec2 = [1, 0];
  public static angle:number = 45;

  static async StartCompute() {
    const gpu = await T3D.InitWebGPU();
    const device = gpu.device;

    //get input parameters
    this.p0 = $('#id-vec2').val()?.toString().split(',').map(Number) as vec2;
    this.angle = parseFloat($('#id-angle').val() as string);
    
    //create buffers
    const pointData = new Float32Array([
      this.p0[0], this.p0[1]
    ]);
    const pointBuffer = T3D.CreateGPUBuffer(device, pointData, GPUBufferUsage.STORAGE);

    const angleBuffer = T3D.CreateGPUBuffer(device, new Float32Array([this.angle]), GPUBufferUsage.UNIFORM | GPUBufferUsage.STORAGE);

    const resultBufferSize = 8;
    const resultBuffer = device.createBuffer({
      size: resultBufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    });

    const bindGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          type: 'storage-buffer'
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          type: 'uniform-buffer'
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          type: 'storage-buffer'
        }
      ]
    });

    const bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: pointBuffer
          }
        },
        {
          binding: 1,
          resource: {
            buffer: angleBuffer
          }
        },
        {
          binding: 2,
          resource: {
            buffer: resultBuffer
          }
        }
      ]
    });

    const computePipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
      }),
      computeStage: {
        module: device.createShaderModule({
          code: Ch14Shaders.wgslShaderCompute
        }),
        entryPoint: "main"
      }
    });

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatch(2);
    passEncoder.endPass();

    //get buffer for reading
    const readBuffer = device.createBuffer({
      size: resultBufferSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
    });

    //copy buffer to buffer.
    commandEncoder.copyBufferToBuffer(resultBuffer, 0, readBuffer, 0, resultBufferSize);

    //submit GPU commands.
    const gpuCommands = commandEncoder.finish();
    device.queue.submit([gpuCommands]);

    //read buffer.
    await readBuffer.mapAsync(GPUMapMode.READ);

    const arrayBuffer = readBuffer.getMappedRange();

    const result =  new Float32Array(arrayBuffer);
    const res =  `(${result[0].toFixed(4)}, ${result[1].toFixed(4)})`;
    
    console.log('result = ' + res);
    $('#id-res').html(res);
  }
}

Ch14Compute.StartCompute();
$('#btn-redraw').on('click', function(){  
  Ch14Compute.StartCompute();
});


