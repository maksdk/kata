export class Textures {
    public static addressModeU = 'repeat';
    public static addressModeV = 'repeat';
    public static uLength = 1;
    public static vLength = 1;

    public static async CreateTexture(device:GPUDevice, imageName:string){
        const img = document.createElement('img') as HTMLImageElement;
        img.src = '../images/' + imageName;
        await img.decode();

        //sampler and texture
        const sampler = device.createSampler({
            minFilter: 'linear',
            magFilter: 'linear',
            mipmapFilter: 'linear',
            addressModeU: this.addressModeU as any,
            addressModeV: this.addressModeV as any
        });

        const imageBitmap = await createImageBitmap(img);

        const texture = device.createTexture({
            size: [imageBitmap.width, imageBitmap.height, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.SAMPLED | GPUTextureUsage.COPY_DST
        });

        device.queue.copyImageBitmapToTexture(
            { imageBitmap },
            { texture: texture },
            [imageBitmap.width, imageBitmap.height, 1]
          );

        return {
            texture,
            sampler
        }
    }
}