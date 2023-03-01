interface IFilter {
    exec(imageData: ImageData): ImageData;
}

declare class ImageFactory {
    private file;
    private canvas;
    private context;
    private imageData;
    width: number;
    height: number;
    image: HTMLImageElement;
    constructor(file?: File | HTMLImageElement);
    private setSize;
    setImage(image: File | HTMLImageElement): this;
    parse(): Promise<ImageFactory>;
    addFilter(filter: IFilter): this;
    generate(type?: string, quality?: number): string;
    reset(): void;
}

declare class GrayscaleFilter implements IFilter {
    exec(imageData: ImageData): ImageData;
}

declare class InverseColorFilter implements IFilter {
    exec(imageData: ImageData): ImageData;
}

declare class BrightnessFilter implements IFilter {
    private brightness;
    /**
     * @param brightness 亮度调节参数, 大于 0 变亮,小于 0 变暗
     */
    constructor(brightness: number);
    exec(imageData: ImageData): ImageData;
}

declare class OldPhotoFilter implements IFilter {
    exec(imageData: ImageData): ImageData;
}

declare class EmbossFilter implements IFilter {
    private data;
    private width;
    private height;
    exec(imageData: ImageData): ImageData;
    /**
     * 获取指定坐标的像素信息
     * @param x 行号
     * @param y 列号
     * @returns 像素点数据
     */
    getPixel(x: number, y: number): {
        r: number;
        g: number;
        b: number;
    };
}

export { BrightnessFilter, EmbossFilter, GrayscaleFilter, IFilter, ImageFactory, InverseColorFilter, OldPhotoFilter };
