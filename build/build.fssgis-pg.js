import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { resolve } from 'path'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'

export default [
  {
    input: resolve('packages', 'fssgis-pg', 'src/index.ts'),
    output: [
      { format: 'cjs', file: resolve('packages', 'fssgis-pg', 'dist/index.js') },
    ],
    external:['pg'],
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
          ["@babel/preset-env", { "targets": {
            "chrome": "81"
          }}]
        ]
      })
    ]
  },
  {
    input: resolve('packages', 'fssgis-pg', 'src/index.ts'),
    output: [
      { format: 'esm', file: resolve('packages', 'fssgis-pg', 'dist/index.d.ts') },
    ],
    plugins: [dts()],
  },
]
