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
export function getLegitimate(value: number) {
  return Math.max(0, Math.min(255, value))
}
