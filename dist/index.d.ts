interface Filter {
    exec(imageData: ImageData): void;
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
    addFilter(filter: Filter): this;
    generate(type?: string, quality?: number): string;
    reset(): void;
}

declare class GrayscaleFilter implements Filter {
    exec(imageData: ImageData): void;
}

declare class InverseColorFilter implements Filter {
    exec(imageData: ImageData): void;
}

export { Filter, GrayscaleFilter, ImageFactory, InverseColorFilter };
