(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ImageFactory = {}));
})(this, (function (exports) { 'use strict';

    class ImageFactory {
        constructor(file) {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            if (file) {
                this.setImage(file);
            }
        }
        setSize(width, height) {
            this.width = width;
            this.height = height;
            this.canvas.width = width;
            this.canvas.height = height;
        }
        setImage(image) {
            this.file = image;
            if (image.constructor === HTMLImageElement) {
                // 如果是图片元素直接 set 不需要解析
                this.image = image;
                this.setSize(image.width, image.height);
            }
            return this;
        }
        parse() {
            if (this.image)
                return Promise.resolve(this);
            else {
                return new Promise((resolve, reject) => {
                    const src = URL.createObjectURL(this.file);
                    let imageObj = new Image();
                    imageObj.src = src;
                    imageObj.onload = () => {
                        this.image = imageObj;
                        this.setSize(imageObj.width, imageObj.height);
                        URL.revokeObjectURL(src);
                        resolve(this);
                    };
                    imageObj.onerror = reject;
                });
            }
        }
        addFilter(filter) {
            if (!this.image) {
                throw new Error('请先添加并解析图片');
            }
            this.context.drawImage(this.image, 0, 0);
            this.imageData = this.context.getImageData(0, 0, this.width, this.height);
            this.context.clearRect(0, 0, this.width, this.height);
            this.imageData = filter.exec(this.imageData);
            return this;
        }
        generate(type = 'image/png', quality = 50) {
            if (!this.imageData) {
                throw new Error('请先添加滤镜');
            }
            this.context.putImageData(this.imageData, 0, 0);
            const src = this.canvas.toDataURL(type, quality / 100);
            this.context.clearRect(0, 0, this.width, this.height);
            this.reset();
            return src;
        }
        reset() {
            this.width = 0;
            this.height = 0;
            this.file = null;
            this.image = null;
            this.imageData = null;
        }
    }

    class GrayscaleFilter {
        // RGB 平均值
        // exec(imageData: ImageData) {
        //   const data = imageData.data
        //   for (let i = 0; i < data.length; i += 4) {
        //     const red = data[i],
        //     green = data[i + 1],
        //     blue = data[i + 2];
        //     // alpha i +3
        //     const average = Math.floor((red + green + blue) / 3)
        //     data[i] = average
        //     data[i + 1] = average
        //     data[i + 2] = average
        //   }
        // }
        // 加权 red*0.3 green*0.59 blue*0.11
        exec(imageData) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const red = data[i], green = data[i + 1], blue = data[i + 2];
                const grayscale = red * 0.3 + green * 0.59 + blue * 0.11;
                data[i] = grayscale;
                data[i + 1] = grayscale;
                data[i + 2] = grayscale;
            }
            return imageData;
        }
    }

    class InverseColorFilter {
        exec(imageData) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const red = 255 - data[i], green = 255 - data[i + 1], blue = 255 - data[i + 2];
                // alpha i +3
                data[i] = red;
                data[i + 1] = green;
                data[i + 2] = blue;
            }
            return imageData;
        }
    }

    /*
     * @Date: 2023-02-28 20:00:30
     * @Author: 枫
     * @LastEditors: 枫
     * @description: RGB 边界值限制
     * @LastEditTime: 2023-02-28 20:02:21
     */
    /**
     * 限制 0- 255范围
     * @param value
     */
    function getLegitimate(value) {
        return Math.max(0, Math.min(255, value));
    }

    class BrightnessFilter {
        /**
         * @param brightness 亮度调节参数, 大于 0 变亮,小于 0 变暗
         */
        constructor(brightness) {
            this.brightness = brightness;
        }
        exec(imageData) {
            const data = imageData.data;
            for (var i = 0; i < data.length; i += 4) {
                const red = data[i + 0], green = data[i + 1], blue = data[i + 2];
                data[i + 0] = getLegitimate(red + this.brightness);
                data[i + 1] = getLegitimate(green + this.brightness);
                data[i + 2] = getLegitimate(blue + this.brightness);
            }
            return imageData;
        }
    }

    class OldPhotoFilter {
        exec(imageData) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const red = data[i + 0], green = data[i + 1], blue = data[i + 2];
                data[i + 0] = red * 0.28 + green * 0.72 + blue * 0.22;
                data[i + 1] = red * 0.25 + green * 0.63 + blue * 0.13;
                data[i + 2] = red * 0.17 + green * 0.66 + blue * 0.13;
            }
            return imageData;
        }
    }

    /*
     * @Date: 2023-02-28 19:47:10
     * @Author: 枫
     * @LastEditors: 枫
     * @description: 浮雕滤镜
     * @LastEditTime: 2023-03-01 10:22:48
     */
    class EmbossFilter {
        exec(imageData) {
            const { width, height, data } = imageData;
            this.data = data;
            this.width = width;
            this.height = height;
            const newData = new Uint8ClampedArray(data.length);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < height; x++) {
                    // 获取相邻像素
                    const currIndex = (y * width + x) * 4;
                    const currPixel = this.getPixel(x, y);
                    const leftPixel = this.getPixel(x - 1, y);
                    const diffR = leftPixel.r - currPixel.r + 128;
                    const diffG = leftPixel.g - currPixel.g + 128;
                    const diffB = leftPixel.b - currPixel.b + 128;
                    newData[currIndex] = diffR;
                    newData[currIndex + 1] = diffG;
                    newData[currIndex + 2] = diffB;
                    newData[currIndex + 3] = data[currIndex + 3];
                }
            }
            return new ImageData(newData, width, height);
        }
        /**
         * 获取指定坐标的像素信息
         * @param x 行号
         * @param y 列号
         * @returns 像素点数据
         */
        getPixel(x, y) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                return { r: 0, g: 0, b: 0 };
            }
            const index = (y * this.width + x) * 4;
            return {
                r: this.data[index],
                g: this.data[index + 1],
                b: this.data[index + 2]
            };
        }
    }

    exports.BrightnessFilter = BrightnessFilter;
    exports.EmbossFilter = EmbossFilter;
    exports.GrayscaleFilter = GrayscaleFilter;
    exports.ImageFactory = ImageFactory;
    exports.InverseColorFilter = InverseColorFilter;
    exports.OldPhotoFilter = OldPhotoFilter;

}));
