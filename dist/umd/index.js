(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ImageFactory = {}));
})(this, (function (exports) { 'use strict';

    var ImageFactory = /** @class */ (function () {
        function ImageFactory(file) {
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('2d');
            if (file) {
                this.setImage(file);
            }
        }
        ImageFactory.prototype.setSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.canvas.width = width;
            this.canvas.height = height;
        };
        ImageFactory.prototype.setImage = function (image) {
            this.file = image;
            if (image.constructor === HTMLImageElement) {
                // 如果是图片元素直接 set 不需要解析
                this.image = image;
                this.setSize(image.width, image.height);
            }
            return this;
        };
        ImageFactory.prototype.parse = function () {
            var _this = this;
            if (this.image)
                return Promise.resolve(this);
            else {
                return new Promise(function (resolve, reject) {
                    var src = URL.createObjectURL(_this.file);
                    var imageObj = new Image();
                    imageObj.src = src;
                    imageObj.onload = function () {
                        _this.image = imageObj;
                        _this.setSize(imageObj.width, imageObj.height);
                        URL.revokeObjectURL(src);
                        resolve(_this);
                    };
                    imageObj.onerror = reject;
                });
            }
        };
        ImageFactory.prototype.addFilter = function (filter) {
            if (!this.image) {
                throw new Error('请先添加并解析图片');
            }
            this.context.drawImage(this.image, 0, 0);
            this.imageData = this.context.getImageData(0, 0, this.width, this.height);
            this.context.clearRect(0, 0, this.width, this.height);
            filter.exec(this.imageData);
            return this;
        };
        ImageFactory.prototype.generate = function (type, quality) {
            if (type === void 0) { type = 'image/png'; }
            if (quality === void 0) { quality = 50; }
            if (!this.imageData) {
                throw new Error('请先添加滤镜');
            }
            this.context.putImageData(this.imageData, 0, 0);
            var src = this.canvas.toDataURL(type, quality / 100);
            this.context.clearRect(0, 0, this.width, this.height);
            this.reset();
            return src;
        };
        ImageFactory.prototype.reset = function () {
            this.width = 0;
            this.height = 0;
            this.file = null;
            this.image = null;
            this.imageData = null;
        };
        return ImageFactory;
    }());

    var GrayscaleFilter = /** @class */ (function () {
        function GrayscaleFilter() {
        }
        // TODO 测试其他灰度算法
        // 加权 red*0.3 green*0.6 blue*0.1
        // 取 green
        GrayscaleFilter.prototype.exec = function (imageData) {
            var data = imageData.data;
            for (var i = 0; i < data.length; i += 4) {
                var red = data[i], green = data[i + 1], blue = data[i + 2];
                // alpha i +3
                var average = Math.floor((red + green + blue) / 3);
                data[i] = average;
                data[i + 1] = average;
                data[i + 2] = average;
            }
        };
        return GrayscaleFilter;
    }());

    var InverseColorFilter = /** @class */ (function () {
        function InverseColorFilter() {
        }
        InverseColorFilter.prototype.exec = function (imageData) {
            var data = imageData.data;
            for (var i = 0; i < data.length; i += 4) {
                var red = 255 - data[i], green = 255 - data[i + 1], blue = 255 - data[i + 2];
                // alpha i +3
                data[i] = red;
                data[i + 1] = green;
                data[i + 2] = blue;
            }
        };
        return InverseColorFilter;
    }());

    exports.GrayscaleFilter = GrayscaleFilter;
    exports.ImageFactory = ImageFactory;
    exports.InverseColorFilter = InverseColorFilter;

}));
