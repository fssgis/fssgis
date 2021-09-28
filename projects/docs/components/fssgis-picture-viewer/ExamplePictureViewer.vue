<script lang="ts" setup>
import { onMounted } from 'vue'
import { PictureViewer } from '@fssgis/picture-viewer'
import 'leaflet/dist/leaflet.css'

onMounted(() => {
  new PictureViewer('leaflet-container', {
    url: 'https://leafletjs.com/examples/crs-simple/uqm_map_full.png'
  })
})

</script>

<template>
  <div
    id="leaflet-container"
    class="w-full"
  />
</template>

<style lang="scss" scoped>
.leaflet-container {
  height: 800px;
}
</style>
