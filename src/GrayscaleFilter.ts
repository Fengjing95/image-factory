/*
 * @Date: 2023-02-27 15:41:03
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 灰度滤镜
 * @LastEditTime: 2023-02-28 10:09:51
  */
import { Filter } from "./IFilter";

export class GrayscaleFilter implements Filter {
  // TODO 测试其他灰度算法
  // 加权 red*0.3 green*0.6 blue*0.1
  // 取 green
  exec(imageData: ImageData) {
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i],
        green = data[i + 1],
        blue = data[i + 2];
      // alpha i +3
      const average = Math.floor((red + green + blue) / 3)

      data[i] = average
      data[i + 1] = average
      data[i + 2] = average
    }
  }
}