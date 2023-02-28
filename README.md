## 图片处理器

只能用于浏览器环境下, 因为底层使用了 canvas 暂时未对 Node 环境进行适配

### 安装

```bash
$ npm install image-factory
```
或者使用你习惯的其他包管理工具

### 使用

1. 首先引入构造函数 ImageFactory, 可以在实例化时传入原始文件或者稍后使用 setImage 方法设置文件(支持 File 和 HTMLImageElement两种类型);
2. 使用 parse 方法解析图片文件, 方法返回一个当前实例的 Promise 对象, 如果传入的是一个 Image 实例, 可以省略这一步, 如果执行了也不会有任何问题, 会直接返回 Promise.resolve;
3. 使用 addFilter 方法为图片添加滤镜, 支持自定义滤镜, 下面有详细描述;
4. 使用 generate 方法导出 base64 的图片, 接收两个参数, 均为可选. 第一个参数用户与设置图片格式(mime), 默认为 `'image/png'`, 第二个参数用于设置导出图片的质量范围 1-100.
5. factory 实例可以持续使用, 但是 generate 之后要重新 setImage, 因为会重置实例内部的数据.

代码描述如下

```typescript
import { ImageFactory, GrayscaleFilter } from 'image-factory'

function handler(e: Event) {
  const file = (<HTMLInputElement>e.target).files[0];
  const image = new ImageFactory(file)
  image.parse().then(i => {
    const src = i.addFilter(new GrayscaleFilter()).generate()
    const img = document.createElement("img");
    img.src = src;
    document.body.appendChild(img);
  })
}

window.onload = () => {
  const fileSelector = document.getElementById('file')
  // HTML 文件中有一个 input 标签, type="file" id="file"
  fileSelector.onchange = handler
}
```

### 滤镜

目前内置了两款滤镜, 后续会继续完善内置滤镜的种类
+ GrayscaleFilter: 灰度滤镜
+ InverseColorFilter: 反色滤镜

支持自定义滤镜处理方式, 需要自定义滤镜需要实现 IFilter 接口, 在给图片添加滤镜时会将 [ImageData](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData) 数据作为参数传给 exec 方法, 你可以直接操作这些 ImageData, 不需要返回任何结果, 即便返回也没有任何作用.