## 图片处理器

只能用于浏览器环境下, 因为底层使用了 canvas 暂时未对 Node 环境进行适配

### 安装

```bash
$ npm install @feng-j/image-factory
```
或者使用你习惯的其他包管理工具

你也可以直接在 HTML 中引入
```HTML
<script src="https://cdn.jsdelivr.net/npm/@feng-j/image-factory/dist/index.umd.min.js"></script>

```
通过 window.ImageFactory 来获取所有的构造函数.

再或者你想使用其他的模块化方案,只需要把 CDN 中的 umd 替换成目标方案即可, 现有四种规范的模块化产物可用(CommonJS, ESM, AMD, UMD, 分别对应 cjs, esm, amd, umd)

### 使用

1. 首先引入构造函数 ImageFactory, 可以在实例化时传入原始文件或者稍后使用 setImage 方法设置文件(支持 File 和 HTMLImageElement两种类型);
2. 使用 parse 方法解析图片文件, 方法返回一个当前实例的 Promise 对象, 如果传入的是一个 Image 实例, 可以省略这一步, 如果执行了也不会有任何问题, 会直接返回 Promise.resolve;
3. 使用 addFilter 方法为图片添加滤镜, 支持自定义滤镜, 下面有详细描述;
4. 使用 generate 方法导出 base64 的图片, 接收两个参数, 均为可选. 第一个参数用户与设置图片格式(mime), 默认为 `'image/png'`, 第二个参数用于设置导出图片的质量范围 1-100.
5. factory 实例可以持续使用, 但是 generate 之后要重新 setImage, 因为会重置实例内部的数据.

代码描述如下

```typescript
import { ImageFactory, GrayscaleFilter } from '@feng-j/image-factory'

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

目前内置了下列滤镜, 后续会继续完善内置滤镜的种类
+ GrayscaleFilter: 灰度滤镜;
+ InverseColorFilter: 反色滤镜;
+ BrightnessFilter: 亮度调节(大于 0 变亮, 小于 0 变暗), 范围-255 到 255(纯黑和纯白),参数直接传入滤镜构造函数;
+ OldPhotoFilter: 老照片滤镜;
+ EmbossFilter: 浮雕滤镜;


支持自定义滤镜处理方式, 需要自定义滤镜需要实现 IFilter 接口
```typescript
interface IFilter {
  exec(imageData: ImageData): ImageData;
}
```

在给图片添加滤镜时会将 [ImageData](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData) 数据作为参数传给 exec 方法, 你可以直接操作这个 ImageData 并返回, 也可以返回一个新的 ImageData 对象.

例如自定义一个CustomFilter 需要像下面这样
```typescript
class CustomFilter implements IFilter {
  exec(imageData) {
    const data = imageData.data

    // 没四位是一个像素点, 分别是 R G B A(透明度)
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255
      data[i + 1] = 0
      data[i + 2] = 0
    }

    return imageData
  }
}
```
上面这个滤镜会将图片转为纯红色