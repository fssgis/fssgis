import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import scss from 'rollup-plugin-scss'
import babel from '@rollup/plugin-babel'
import { resolve } from 'path'

export default [
  {
    input: resolve('packages', 'fssgis-grid', 'src/index.ts'),
    output: [
      { format: 'esm', file: resolve('packages', 'fssgis-grid', 'dist/index.js') },
    ],
    external:['vue', '@fssgis/utils', '@fssgis/icon'],
    plugins: [
      typescript({
        'module': 'esnext',
        useTsconfigDeclarationDir: true
      }),
      commonjs(),
      babel({ babelHelpers: 'bundled', extensions: ['.ts', '.js', '.tsx'], plugins: [['@vue/babel-plugin-jsx']] }),
      nodeResolve(),
      scss(),
    ]
  },
  {
    input: resolve('packages', 'fssgis-grid', 'src/index.ts'),
    output: [
      { format: 'esm', file: resolve('packages', 'fssgis-grid', 'dist/index.d.ts') },
    ],
    external:['./fssg-grid.scss', './fssg-box.scss'],
    plugins: [dts()]
  }
]