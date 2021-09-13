# @fssgis/esri

![npm version](https://img.shields.io/npm/v/@fssgis/fssg-esri.svg)    ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/fssg-esri.svg?color=orange)

## 介绍

基于ArcGIS API for JavaScript的二次开发地图库

- use `TypeScript`
- build with `Rollup`
- 业务功能插件化，按需加载
- 提供Composition API库`@fssgis/esri-hooks` ![npm version](https://img.shields.io/npm/v/@fssgis/fssg-esri-hooks.svg)    ![downloads-badge](https://img.shields.io/npm/dm/@fssgis/fssg-esri-hooks.svg?color=orange)，支持Vue3

## 基本使用

```bash
npm i @fssgis/fssg-esri
```

```js
import { /* ... */ } from '@fssgis/fssg-esri'
```

## 架构设计

...

## 案例（基于Vue框架）

### 地图的初始化

<br>

#### 方式一：原生方式

```js
import { FssgEsri } from '@fssgis/fssg-esri'
const fssgEsri = new FssgEsri(id, { // id is from map document's id
  mapOptions: { basemap: 'arcgis-topographic' },
  viewOptions: { center: [113, 23], zoom: 10 },
})
fssgEsri.mount() // when the map document is rendered, execute it
```

<BaseMapContainer><ExampleMapInit /></BaseMapContainer>

<br>

#### 方式二：基于Vue3 `Provide` and `Inject`的方式

```vue
<!-- Parent.vue -->
<script setup>
import { createFssgEsri } from '@fssgis/fssg-esri-hooks'
const fssgEsri = createFssgEsri(id, { // id is from map document's id
  mapOptions: { basemap: 'arcgis-topographic' },
  viewOptions: { center: [114, 30], zoom: 7, },
})
</script>
```

```vue
<!-- Child.vue -->
<script setup>
import { useFssgEsri } from '@fssgis/fssg-esri-hooks'
const fssgEsri = useFssgEsri() // use this function can get the map object
</script>
```



<BaseMapContainer><ExampleMapInit2 /></BaseMapContainer>