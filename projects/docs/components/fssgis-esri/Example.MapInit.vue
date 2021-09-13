<template>
  <div />
</template>

<script lang="ts" setup>
import { inject, onMounted } from 'vue'
import { FssgEsri } from '@fssgis/fssg-esri'

const id = inject('id') as string
onMounted(() => {
  new FssgEsri(id, {
    mapOptions: {
      basemap: 'arcgis-topographic',
    },
    viewOptions: {
      center: [113, 23],
      zoom: 10,
    },
  }).mount()
})


</script>

<style lang="scss" scoped>

</style>
