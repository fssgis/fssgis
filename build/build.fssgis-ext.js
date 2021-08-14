import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { resolve } from 'path'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'

export default [
  {
    input: resolve('packages', 'fssgis-ext', 'src/index.ts'),
    output: [
      { format: 'esm', file: resolve('packages', 'fssgis-ext', 'dist/index.esm.js') },
      { format: 'cjs', file: resolve('packages', 'fssgis-ext', 'dist/index.cjs.js') },
    ],
    plugins: [
      typescript(),
      commonjs(),
      nodeResolve(),
      json(),
      babel({
        exclude: "node_modules/**",
        babelHelpers: 'bundled',
        extensions: ['.ts', '.js', '.tsx'],
        presets: [
          '@babel/preset-env'
        ]
      })
    ]
  },
  {
    input: resolve('packages', 'fssgis-ext', 'src/index.ts'),
    output: [
      { format: 'esm', file: resolve('packages', 'fssgis-ext', 'dist/index.d.ts') },
    ],
    plugins: [dts()],
  },
]
