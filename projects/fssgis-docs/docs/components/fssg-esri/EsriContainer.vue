<template>
  <div
    :id="id"
    style="height: 500px;"
  />
  <slot v-if="loaded" />
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, ref } from 'vue'
import { FssgEsri } from '@fssgis/fssg-esri'
import { createGuid } from '@fssgis/utils'

export default defineComponent({
  setup () {
    const id = createGuid()

    const fssgEsri = new FssgEsri(id, {
      mapOptions: {
        basemap: 'arcgis-topographic',
      },
      viewOptions: {
        center: [113, 23],
        zoom: 10,
      },
      debug: true,
    })
    provide('fssgEsri', fssgEsri)
    onMounted(() => fssgEsri.mount())

    const loaded = ref(false)
    fssgEsri.when(() => loaded.value = true)

    return {
      loaded,
      id,
    }
  },
})
</script>

