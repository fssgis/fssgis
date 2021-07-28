# Grid布局组件 @fssgis/grid

## 介绍

统一可复用的Grid布局组件。

Grid布局介绍：https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid

Grid布局介绍：http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html

Grid布局生成器：https://grid.layoutit.com/

## 安装

```shell
npm install --save @fssgis/grid
```

## 使用

```js
import {
  FssgGrid,
  FssgBoxV1,
  FssgBoxV2,
  FssgBoxV3,
  FssgBoxV4,
} from '@fssgis/grid'
import '@fssgis/grid/dist/index.css'
```

## 接口

### FssgGrid

| 属性    | 类型               | 必要性 | 默认值 | 描述                                      |
| ------- | ------------------ | ------ | ------ | ----------------------------------------- |
| options | `IFssgGridOptions` | *      |        | Grid布局配置项                            |
| inline  | `boolean`          | -      | false  | 是否设置为行内的Grid布局，即`inline-grid` |
| margin  | `string`           | -      |        | Grid布局中各个项的间隙                    |

```typescript
type GridAreas = number[][]

interface IFssgGridOptions {
  gridAreas: GridAreas
  templateRows?: string
  templateColumns?: string
  gap?: string
  width?: string
  height?: string
}
```

### FssgBox[V1,V2,V3,V4]

| 属性       | 类型                | 必要性 | 默认值 | 描述     |
| ---------- | ------------------- | ------ | ------ | -------- |
| title      | `string`            | -      |        | 标题     |
| value      | `string`or `number` | -      |        | 值       |
| unit       | `string`            | -      |        | 单位     |
| iconUrl    | `string`            | -      |        | 图标路径 |
| iconStyle  | `CSSProperties`     | -      | {}     | 图标样式 |
| titleStyle | `CSSProperties`     | -      | {}     | 标题样式 |
| valueStyle | `CSSProperties`     | -      | {}     | 值样式   |
| unitStyle  | `CSSProperties`     | -      | {}     | 单位样式 |

