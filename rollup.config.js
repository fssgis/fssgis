import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import path from 'path'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'

const pathResolve = (...args) => path.resolve(...args)

function createCore (dirName, external = []) {
  return [
    {
      input: pathResolve('packages', dirName, 'src/index.ts'),
      output: [
        { format: 'esm', file: pathResolve('packages', dirName, 'dist/index.esm.js') },
        { format: 'cjs', file: pathResolve('packages', dirName, 'dist/index.cjs.js') },
      ],
      external:[...external],
      plugins: [
        typescript(),
        commonjs(),
        nodeResolve(),
        json(),
      ]
    },
    {
      input: pathResolve('packages', dirName, 'src/index.ts'),
      output: [
        { format: 'esm', file: pathResolve('packages', dirName, 'dist/index.d.ts') },
      ],
      plugins: [dts()]
    }
  ]
}

export default [
  ...createCore('fssgis-observable'),
  ...createCore('fssgis-utils'),
  ...createCore('fssgis-ext'),
  ...createCore('fssgis-storage'),
  ...createCore('fssgis-axios', ['axios']),
  ...createCore('fssgis-map', ['@fssgis/utils', '@fssgis/observable']),
  ...createCore('fssgis-attributes', ['vue']),
]
