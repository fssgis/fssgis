<template>
  <div
    :id="id"
    style="height: 500px;"
  />
  <slot v-if="loaded" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { createFssgEsri, useFssgEsriLoaded } from '@fssgis/fssg-esri-hooks'
import { createGuid } from '@fssgis/utils'

export default defineComponent({
  setup () {
    const id = createGuid()

    const fssgEsri = createFssgEsri(id, {
      mapOptions: {
        basemap: 'arcgis-topographic',
      },
      viewOptions: {
        center: [113, 23],
        zoom: 10,
      },
      debug: true,
    })

    const loaded = useFssgEsriLoaded(fssgEsri)

    return {
      loaded,
      id,
    }
  },
})
</script>

