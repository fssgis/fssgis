<template>
  <div
    id="esri-container"
    style="height: 500px;"
  />
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
    onMounted(() => fssgEsri.mount())
  },
})
</script>

