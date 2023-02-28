/*
  * @Date: 2023-02-27 15:39:23
  * @Author: 枫
  * @LastEditors: 枫
  * @description: 图片处理器
  * @LastEditTime: 2023-02-28 09:52:11
  */
import { Filter } from "./IFilter"

export class ImageFactory {
  private file: File | HTMLImageElement // 原始文件
  private canvas: HTMLCanvasElement // canvas 对象
  private context: CanvasRenderingContext2D // context 对象
  private imageData: ImageData
  width: number // 宽
  height: number // 高
  image: HTMLImageElement // 图片DOM对象
  constructor(file?: File | HTMLImageElement) {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    if (file) {
      this.setImage(file)
    }
  }

  private setSize(width: number, height: number) {
    this.width = width
    this.height = height
    this.canvas.width = width
    this.canvas.height = height
  }

  setImage(image: File | HTMLImageElement) {
    this.file = image
    if (image.constructor === HTMLImageElement) {
      // 如果是图片元素直接 set 不需要解析
      this.image = image
      this.setSize(image.width, image.height)
    }
    return this
  }

  parse(): Promise<ImageFactory> {
    if (this.image) return Promise.resolve(this)
    else {
      return new Promise((resolve, reject) => {
        const src = URL.createObjectURL(this.file as File)
        let imageObj = new Image()
        imageObj.src = src
        imageObj.onload = () => {
          this.image = imageObj
          this.setSize(imageObj.width, imageObj.height)
          URL.revokeObjectURL(src)
          resolve(this)
        }
        imageObj.onerror = reject
      })
    }
  }

  addFilter(filter: Filter) {
    if (!this.image) {
      throw new Error('请先添加并解析图片')
    }
    this.context.drawImage(this.image, 0, 0)
    this.imageData = this.context.getImageData(0, 0, this.width, this.height)
    this.context.clearRect(0, 0, this.width, this.height)
    filter.exec(this.imageData)
    return this
  }

  generate(type = 'image/png', quality = 50) {
    if (!this.imageData) {
      throw new Error('请先添加滤镜')
    }
    this.context.putImageData(this.imageData, 0, 0)
    const src = this.canvas.toDataURL(type, quality / 100)
    this.context.clearRect(0, 0, this.width, this.height)
    this.reset()
    return src
  }

  reset() {
    this.width = 0
    this.height = 0
    this.file = null
    this.image = null
    this.imageData = null
  }
}

