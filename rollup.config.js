/*
 * @Date: 2023-02-28 14:19:17
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2023-02-28 17:04:58
 */
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.common.js',
        format: 'cjs', // CommonJS 模块化方案
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm', // ES6 模块化方案
      },
      {
        file: 'dist/index.amd.js',
        format: 'amd', // AMD 模块化方案
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd', // UMD 模块化方案
        name: 'ImageFactory', // UMD 模块化方案需要指定全局变量名称
      },
    ],
    plugins: [
      typescript(),
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [dts()],
    output: {
      format: 'esm',
      file: 'dist/index.d.ts',
    },
  },
];
