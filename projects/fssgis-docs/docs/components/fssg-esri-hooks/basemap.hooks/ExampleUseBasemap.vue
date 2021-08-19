<template>
  <div
    :id="id"
    style="height: 500px;"
  />
  <slot v-if="loaded" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { createBasemap, createFssgEsri, useFssgEsriLoaded } from '@fssgis/fssg-esri-hooks'
import { createGuid } from '@fssgis/utils'

export default defineComponent({
  setup () {
    const id = createGuid()

    const fssgEsri = createFssgEsri(id, {
      viewOptions: { center: [110, 33], zoom: 4 },
      debug: true,
    })

    createBasemap({}, fssgEsri)

    const loaded = useFssgEsriLoaded(fssgEsri)

    return {
      loaded,
      id,
    }
  },
})
</script>

