/*
 * @Date: 2023-02-28 19:36:51
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 老照片滤镜
 * @LastEditTime: 2023-03-01 10:22:30
 */
import { IFilter } from "./IFilter";

export class OldPhotoFilter implements IFilter {
  exec(imageData: ImageData): ImageData {
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const red = data[i + 0],
        green = data[i + 1],
        blue = data[i + 2]

      data[i + 0] = red * 0.28 + green * 0.72 + blue * 0.22
      data[i + 1] = red * 0.25 + green * 0.63 + blue * 0.13
      data[i + 2] = red * 0.17 + green * 0.66 + blue * 0.13
    }

    return imageData
  }
}
