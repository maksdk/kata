import { Transforms as T3D } from '../common/transforms';
import $ from 'jquery';
import { vec2 } from 'gl-matrix';

export class Ch14Test {
    public static result = 'not started';
    public static p0: vec2 = [1, 0];
    public static angle: number = 45;

    static async CreateTest() {
        const gpu = await T3D.InitWebGPU();
        const device = gpu.device;

        const rotateData = new Float32Array([
            2, 2,
            Math.cos(this.angle * Math.PI / 180), Math.sin(this.angle * Math.PI / 180),
            -Math.sin(this.angle * Math.PI / 180), Math.cos(this.angle * Math.PI / 180)
        ]);
        const rotateBuffer = T3D.CreateGPUBuffer(device, rotateData, GPUBufferUsage.STORAGE);

        const pointData = new Float32Array([
            2, 1,
            this.p0[0],
            this.p0[1]
        ]);
        const pointBuffer = T3D.CreateGPUBuffer(device, pointData, GPUBufferUsage.STORAGE);

        const resultBufferSize = 16;
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
                    type: 'storage-buffer'
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
                        buffer: rotateBuffer
                    }
                },
                {
                    binding: 1,
                    resource: {
                        buffer: pointBuffer
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
                    code: this.wgslComputeShader
                }),
                entryPoint: "main"
            }
        });

        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();

        passEncoder.setPipeline(computePipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatch(rotateData[0], pointData[1]);
        passEncoder.endPass();

        // Get a GPU buffer for reading in an unmapped state.
        const readBuffer = device.createBuffer({
            size: resultBufferSize,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });

        // Encode commands for copying buffer to buffer.
        commandEncoder.copyBufferToBuffer(
            resultBuffer,           //source buffer
            0,                      //source offset
            readBuffer,          //destination buffer 
            0,                      //destination offset 
            resultBufferSize  //size
        );

        // Submit commands
        const gpuCommands = commandEncoder.finish();
        device.queue.submit([gpuCommands]);

        // Read result
        await readBuffer.mapAsync(GPUMapMode.READ);

        const arrayBuffer = readBuffer.getMappedRange();

        this.result = JSON.stringify(new Float32Array(arrayBuffer), null, 4);
        $('#id-res').html(this.result);
    }

    public static wgslComputeShader = `
      type Arr = [[stride(4)]] array<f32>;
      [[block]] struct MatrixFormat {
          [[offset(0)]] size: vec2<f32>;
          [[offset(8)]] numbers: Arr;
      };
      [[binding(0), group(0)]] var<storage_buffer> firstMatrix: MatrixFormat;
      [[binding(1), group(0)]] var<storage_buffer> secondMatrix: MatrixFormat;
      [[binding(2), group(0)]] var<storage_buffer> resultMatrix: MatrixFormat;

      [[builtin(global_invocation_id)]] var<in> GlobalInvocationID : vec3<u32>;

      [[stage(compute)]]
      fn main() -> void {
        resultMatrix.size = vec2<f32>(firstMatrix.size.x, secondMatrix.size.y);
        var resultCell:vec2<u32> = vec2<u32>(GlobalInvocationID.x, GlobalInvocationID.y);

        var result:f32 = 0.0;
        for (var i:u32 = 0u; i < u32(firstMatrix.size.y); i=i+1u) {
          var a:u32 = i + resultCell.x * u32(firstMatrix.size.y);
          var b:u32 = resultCell.y + i * u32(secondMatrix.size.y);
          result = result + firstMatrix.numbers[a] * secondMatrix.numbers[b];
        }

        var index:u32 = resultCell.y + resultCell.x * u32(secondMatrix.size.y);
        resultMatrix.numbers[index] = result;
      }`;

    public static computeShaderCode = `#version 450
      layout(std430, set = 0, binding = 0) readonly buffer FirstMatrix {
          vec2 size;
          float numbers[];
      } firstMatrix;
    
      layout(std430, set = 0, binding = 1) readonly buffer SecondMatrix {
          vec2 size;
          float numbers[];
      } secondMatrix;
    
      layout(std430, set = 0, binding = 2) buffer ResultMatrix {
          vec2 size;
          float numbers[];
      } resultMatrix;
    
      void main() {
        resultMatrix.size = vec2(firstMatrix.size.x, secondMatrix.size.y);
    
        ivec2 resultCell = ivec2(gl_GlobalInvocationID.x, gl_GlobalInvocationID.y);
        float result = 0.0;
        for (int i = 0; i < firstMatrix.size.y; i++) {
          int a = i + resultCell.x * int(firstMatrix.size.y);
          int b = resultCell.y + i * int(secondMatrix.size.y);
          result += firstMatrix.numbers[a] * secondMatrix.numbers[b];
        }
    
        int index = resultCell.y + resultCell.x * int(secondMatrix.size.y);
        resultMatrix.numbers[index] = result;
      }
    `;
}

Ch14Test.CreateTest();


