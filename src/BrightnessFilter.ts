/*
 * @Date: 2023-02-28 19:20:04
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 调整亮度
 * @LastEditTime: 2023-03-01 10:22:52
 */
import { IFilter } from "./IFilter";
import { getLegitimate } from "./utils/boundary";

export class BrightnessFilter implements IFilter {
  private brightness: number;

  /**
   * @param brightness 亮度调节参数, 大于 0 变亮,小于 0 变暗
   */
  constructor(brightness: number) {
    this.brightness = brightness;
  }
  
  exec(imageData: ImageData): ImageData {
    const data = imageData.data
    for (var i = 0; i < data.length; i += 4) {
      const red = data[i + 0],
        green = data[i + 1],
        blue = data[i + 2]
      
      data[i + 0] = getLegitimate(red + this.brightness)
      data[i + 1] = getLegitimate(green + this.brightness)
      data[i + 2] = getLegitimate(blue + this.brightness)
    }
    
    return imageData
  }
}
