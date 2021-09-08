# FSSGIS

## Features

- **FSSG** & **GIS**
- 基于`Lerna`进行多包的版本控制与发布
- 使用`TypeScript`语言开发，增加类型推断
- 使用`Rollup`打包构建代码
- 结合`Jest`进行单元测试

## Packages

| Name          | Description | View                                                     |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `@fssgis/fssg-esri`       | @arcgis/core二次开发库 | ![npm version](https://img.shields.io/npm/v/@fssgis/fssg-esri.svg)   ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/fssg-esri.svg?color=blue) |
| `@fssgis/fssg-esri-hooks` | `@fssgis/fssg-esri`的`Composition API`库 | ![npm version](https://img.shields.io/npm/v/@fssgis/fssg-esri-hooks.svg)   ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/fssg-esri-hooks.svg?color=blue) |
| `@fssgis/fssg-map`       | 前端地图库的二次开发集成*标准库* | ![npm version](https://img.shields.io/npm/v/@fssgis/fssg-map.svg)   ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/fssg-map.svg?color=blue) |
| `@fssgis/fssg-leaflet`      | `leaflet`二次开发库 | ![npm version](https://img.shields.io/npm/v/@fssgis/fssg-leaflet.svg)   ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/fssg-leaflet.svg?color=blue) |
| `@fssgis/axios`      | `axios`二次继承库 | ![npm version](https://img.shields.io/npm/v/@fssgis/axios.svg)   ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/axios.svg?color=blue) |
| `@fssgis/ext`             | JavaScript原型扩展装饰器，使用**单例模式** | ![npm version](https://img.shields.io/npm/v/@fssgis/ext.svg)   ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/ext.svg?color=blue) |
| `@fssgis/generic`         | TypeScript泛型集成 | ![npm version](https://img.shields.io/npm/v/@fssgis/generic.svg)   ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/generic.svg?color=blue) |
| `@fssgis/observable`      | 观测者类（on, off, once, fire） | ![npm version](https://img.shields.io/npm/v/@fssgis/observable.svg)   ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/observable.svg?color=blue) |
| `@fssgis/storage`         | 浏览器存储工具类（`cookie`, `localstorage`, `sessionstorage`） | ![npm version](https://img.shields.io/npm/v/@fssgis/storage.svg)   ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/storage.svg?color=blue) |
| `@fssgis/ui`         | VueUI库   | ![npm version](https://img.shields.io/npm/v/@fssgis/ui.svg)   ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/ui.svg?color=blue) |
| `@fssgis/utils`           | JavaScript工具库 | ![npm version](https://img.shields.io/npm/v/@fssgis/utils.svg)   ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/utils.svg?color=blue) |

## Todos

- [ ] 自动化打包
- [ ] 自动化版本控制与发布（*应对`Lerna`的不稳定性*）