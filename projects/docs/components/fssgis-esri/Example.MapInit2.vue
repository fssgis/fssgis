<template>
  <div>
    <Child />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, h, inject } from 'vue'
import { createFssgEsri, useFssgEsri } from '@fssgis/fssg-esri-hooks'

const id = inject('id') as string

const fssgEsri = createFssgEsri(id, {
  mapOptions: {
    basemap: 'arcgis-topographic',
  },
  viewOptions: {
    center: [114, 30],
    zoom: 7,
  },
})

const Child = defineComponent({
  setup () {
    const fssgEsri = useFssgEsri()
    return {
      fssgEsri
    }
  },
  render () {
    return h('code', `${JSON.stringify(fssgEsri)}`)
  }
})

</script>

<style lang="scss" scoped>

</style>
