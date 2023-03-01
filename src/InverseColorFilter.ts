/*
 * @Date: 2023-02-28 09:42:26
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 反色滤镜
 * @LastEditTime: 2023-03-01 10:22:22
 */
import { IFilter } from "./IFilter";

export class InverseColorFilter implements IFilter {
  exec(imageData: ImageData): ImageData {
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const red = 255 - data[i],
        green = 255 - data[i + 1],
        blue = 255 - data[i + 2];
      // alpha i +3

      data[i] = red
      data[i + 1] = green
      data[i + 2] = blue
    }
    
    return imageData
  }
}
