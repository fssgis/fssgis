import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { resolve } from 'path'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'

export default [
  {
    input: resolve('packages', 'fssg-esri', 'src/index.ts'),
    output: [
      { format: 'esm', file: resolve('packages', 'fssg-esri', 'dist/index.js') },
    ],
    external:[
      '@fssgis/fssg-map',
      '@fssgis/observable',
      '@fssgis/utils',
      '@arcgis/core/Map',
      '@arcgis/core/views/MapView',
      '@arcgis/core/config',
      '@arcgis/core/geometry/Point',
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
          ["@babel/preset-env", { "targets": {
            "chrome": "81"
          }}]
        ]
      })
    ]
  },
  {
    input: resolve('packages', 'fssg-esri', 'src/index.ts'),
    output: [
      { format: 'esm', file: resolve('packages', 'fssg-esri', 'dist/index.d.ts') },
    ],
    plugins: [dts()]
  }
]