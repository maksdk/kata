export class Textures {
    public static addressModeU = 'repeat';
    public static addressModeV = 'repeat';
    public static uLength = 1;
    public static vLength = 1;

    public static async CreateTexture(device:GPUDevice, imageName:string){
        const img = document.createElement('img');
        img.src = '../images/' + imageName;
        await img.decode();
        const imageBitmap = await createImageBitmap(img);

        //sampler and texture
        const sampler = device.createSampler({
            minFilter: 'linear',
            magFilter: 'linear',
            mipmapFilter: 'linear',
            addressModeU: this.addressModeU as GPUAddressMode,
            addressModeV: this.addressModeV as GPUAddressMode
        });       

        const texture = device.createTexture({
            size: [imageBitmap.width, imageBitmap.height, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        });

        /*device.queue.copyImageBitmapToTexture(
            { imageBitmap },
            { texture: texture },
            [imageBitmap.width, imageBitmap.height, 1]
        );*/

        device.queue.copyExternalImageToTexture(
            { source: imageBitmap },
            { texture: texture },
            [imageBitmap.width, imageBitmap.height]
        );

        return {
            texture,
            sampler
        }
    }
}