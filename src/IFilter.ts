/*
 * @Date: 2023-02-27 15:39:53
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 滤镜接口
 * @LastEditTime: 2023-02-27 15:42:08
 */
export interface Filter {
  exec(imageData: ImageData): void;
}