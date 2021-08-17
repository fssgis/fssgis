# 底图控制插件 Basemap

<EsriBasemap />

```vue
<template>
  <div id="esri-container" style="height: 500px;" />
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { FssgEsri, Basemap } from '@fssgis/fssg-esri'

export default defineComponent({
  setup () {
    const basemap = new Basemap({
      selectedKey: '天地图影像3857', // 内置 天地图[影像、矢量、地形][3857、4326]
      items: [
        {
          key: '彩色地图',
          type: 'webtilelayer',
          url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{level}/{row}/{col}',,
          props: {
            opacity: .5
          }
        }
      ]
    })

    const fssgEsri = new FssgEsri('esri-container', {
      viewOptions: { center: [110, 33], zoom: 4 }
    })
      .use(basemap)
    onMounted(() => fssgEsri.mount())
    
    const itemKeys = ['彩色地图', '天地图影像3857', '天地图影像含注记3857', '天地图矢量3857', '天地图矢量含注记3857', '天地图地形3857', '天地图地形含注记3857']
    let i = 0
    const handle = setInterval(() => {
      basemap.selectedKey = itemKeys[i++ % itemKeys.length]
    }, 1500)
    onUnmounted(() => clearInterval(handle))
  },
})
</script>
```

