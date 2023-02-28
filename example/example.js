/*
 * @Date: 2023-02-28 09:50:07
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2023-02-28 15:12:36
 */

import { ImageFactory, GrayscaleFilter } from "../dist/esm/index.js";

const image = new ImageFactory()
function handler(e) {
  const file = e.target.files[0];
  image.setImage(file)
  image.parse().then(i => {
    const src = i.addFilter(new GrayscaleFilter()).generate()
    const img = document.createElement("img");
    img.src = src;
    document.body.appendChild(img);
  })
}

window.onload = () => {
  const fileSelector = document.getElementById('file')
  fileSelector.onchange = handler
}
