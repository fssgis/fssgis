## useZoom 响应式缩放等级

<EsriContainer><ExampleUseZoom /></EsriContainer>

```vue
<template>
  <span>缩放等级：{{ zoom }}</span><br>
  <button @click="stopWatch">停止监听</button>
  <button @click="startWatch">开始监听</button>
</template>

<script lang="ts">
import { FssgEsri } from '@fssgis/fssg-esri'
import { useZoom } from '@fssgis/fssg-esri-hooks'
import { defineComponent, inject } from 'vue'

export default defineComponent({
  setup () {
    const fssgEsri = /* get fssgEsri which has mounted */ xxx
    const { zoom, stopWatch, startWatch } = useZoom(fssgEsri)

    return { zoom, stopWatch, startWatch }
  },
})
</script>
```

## useCenter 响应式地图中心点

<EsriContainer><ExampleUseCenter /></EsriContainer>

```vue
<script lang="ts">
import { FssgEsri } from '@fssgis/fssg-esri'
import { useCenter } from '@fssgis/fssg-esri-hooks'
import { computed, defineComponent, inject } from 'vue'

export default defineComponent({
  setup () {
    const fssgEsri = /* get fssgEsri which has mounted */ xxx
    const { center, stopWatch, startWatch, watchStatus } = useCenter(fssgEsri)

    const centerStr = computed(() => {
      const pt = center.value
      return `x: ${pt.x}, y: ${pt.y}, lon: ${pt.longitude}, lat: ${pt.latitude}`
    })

    return { stopWatch, startWatch, watchStatus, centerStr }
  },
})
</script>
```

