# Basemap响应式

<ExampleUseBasemap />

## useBasemapState

<ExampleUseBasemap><ExampleUseBasemapState /></ExampleUseBasemap>

```vue
<template>
  <div>
    <button @click="visible = !visible">
      {{ visible ? '可见': '不可见' }}
    </button>
    <button @click="basemap.visible = !visible">
      {{ visible ? '可见': '不可见' }}
    </button><br>
    <select :value="selectedKey" @change="e => selectedKey = e.target.value">
      <option v-for="(item, index) in itemKeys" :key="index">
        {{ item }}
      </option>
    </select>
    <select :value="selectedKey" @change="e => fssgMap.basemap.selectedKey = e.target.value">
      <option v-for="(item, index) in itemKeys" :key="index">
        {{ item }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { useBasemap, useBasemapState, useFssgEsri } from '@fssgis/fssg-esri-hooks'
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    const fssgMap = useFssgEsri()
    const basemap = useBasemap()
    const { visible, selectedKey } = useBasemapState(basemap)
    const itemKeys = ['天地图影像3857', '天地图影像含注记3857', '天地图矢量3857', '天地图矢量含注记3857', '天地图地形3857', '天地图地形含注记3857']

    return {
      visible, selectedKey, itemKeys, fssgMap, basemap
    }
  },
})
</script>
```

