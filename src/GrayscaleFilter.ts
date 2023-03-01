/*
 * @Date: 2023-02-27 15:41:03
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 灰度滤镜
 * @LastEditTime: 2023-03-01 10:22:02
  */
import { IFilter } from "./IFilter";

export class GrayscaleFilter implements IFilter {
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
  exec(imageData: ImageData): ImageData {
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const red = data[i],
        green = data[i + 1],
        blue = data[i + 2];
      
      const grayscale = red * 0.3 + green * 0.59 + blue * 0.11

      data[i] = grayscale
      data[i + 1] = grayscale
      data[i + 2] = grayscale
    }

    return imageData
  }
}