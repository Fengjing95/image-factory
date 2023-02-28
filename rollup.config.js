/*
 * @Date: 2023-02-28 14:19:17
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2023-02-28 14:22:02
 */
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/commonjs/index.js',
        format: 'cjs', // CommonJS 模块化方案
      },
      {
        file: 'dist/esm/index.js',
        format: 'esm', // ES6 模块化方案
      },
      {
        file: 'dist/amd/index.js',
        format: 'amd', // AMD 模块化方案
      },
      {
        file: 'dist/umd/index.js',
        format: 'umd', // UMD 模块化方案
        name: 'ImageFactory', // UMD 模块化方案需要指定全局变量名称
      },
    ],
    plugins: [
      typescript(),
    ],
  },
];
