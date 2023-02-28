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
            filter.exec(this.imageData);
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
        // TODO 测试其他灰度算法
        // 加权 red*0.3 green*0.6 blue*0.1
        // 取 green
        exec(imageData) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const red = data[i], green = data[i + 1], blue = data[i + 2];
                // alpha i +3
                const average = Math.floor((red + green + blue) / 3);
                data[i] = average;
                data[i + 1] = average;
                data[i + 2] = average;
            }
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
        }
    }

    exports.GrayscaleFilter = GrayscaleFilter;
    exports.ImageFactory = ImageFactory;
    exports.InverseColorFilter = InverseColorFilter;

}));
