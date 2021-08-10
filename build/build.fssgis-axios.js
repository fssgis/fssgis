import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { resolve } from 'path'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'

export default [
  {
    input: resolve('packages', 'fssgis-axios', 'src/index.ts'),
    output: [
      { format: 'esm', file: resolve('packages', 'fssgis-axios', 'dist/index.esm.js') },
      { format: 'cjs', file: resolve('packages', 'fssgis-axios', 'dist/index.cjs.js') },
    ],
    external:['axios'],
    plugins: [
      typescript(),
      commonjs(),
      nodeResolve(),
      json(),
    ]
  },
  {
    input: resolve('packages', 'fssgis-axios', 'src/index.ts'),
    output: [
      { format: 'esm', file: resolve('packages', 'fssgis-axios', 'dist/index.d.ts') },
    ],
    plugins: [dts()],
  },
]
