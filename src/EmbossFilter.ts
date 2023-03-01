/*
 * @Date: 2023-02-28 19:47:10
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 浮雕滤镜
 * @LastEditTime: 2023-03-01 10:22:48
 */

import { IFilter } from "./IFilter";

export class EmbossFilter implements IFilter {
  private data: Uint8ClampedArray;
  private width: number;
  private height: number;

  exec(imageData: ImageData): ImageData {
    const { width, height, data } = imageData
    this.data = data
    this.width = width
    this.height = height
    const newData = new Uint8ClampedArray(data.length)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < height; x++) {
        // 获取相邻像素
        const currIndex = (y * width + x) * 4
        const currPixel = this.getPixel(x, y)
        const leftPixel = this.getPixel(x - 1, y)

        const diffR = leftPixel.r - currPixel.r + 128
        const diffG = leftPixel.g - currPixel.g + 128
        const diffB = leftPixel.b - currPixel.b + 128

        newData[currIndex] = diffR
        newData[currIndex + 1] = diffG
        newData[currIndex + 2] = diffB
        newData[currIndex + 3] = data[currIndex + 3]
      }
    }

    return new ImageData(newData, width, height)
  }

  /**
   * 获取指定坐标的像素信息
   * @param x 行号
   * @param y 列号
   * @returns 像素点数据
   */
  getPixel(x: number, y: number) {
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