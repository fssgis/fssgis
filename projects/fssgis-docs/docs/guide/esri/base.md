## 介绍

- 使用ArcGIS API for JavaScript 4.x地图框架实现
- 基于**业务功能型**二次开发的地图库
- 以[@fssgis/fssg-map](/guide/map/fssg-map.html)作为基准

## 引入与使用

```bash
npm i @fssgis/fssg-esri
```

```js
import { /* ... */ } from '@fssgis/fssg-esri'
```

<EsriBeginToStart />

```vue
<template>
  <div id="esri-container" style="height: 500px;" />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { FssgEsri } from '@fssgis/fssg-esri'

export default defineComponent({
  setup () {
    const fssgEsri = new FssgEsri('esri-container', {
      mapOptions: {
        basemap: 'arcgis-topographic',
      },
      viewOptions: {
        center: [113, 23],
        zoom: 10,
      },
    })

    // 当地图容器绑定的dom元素渲染完后执行fssgEsri的mount()方法进行初始化
    onMounted(() => fssgEsri.mount())

  },
})
</script>
```

