<template>
  <span>地图中心：{{ centerStr }}</span><br>
  <button @click="stopWatch">
    停止监听
  </button>
  <button @click="startWatch">
    开始监听
  </button>
  <span>监听状态：{{ watchStatus ? '开' : '关' }}</span>
</template>

<script lang="ts">
import { FssgEsri } from '@fssgis/fssg-esri'
import { useCenter } from '@fssgis/fssg-esri-hooks'
import { computed, defineComponent, inject } from 'vue'

export default defineComponent({
  components: {
  },
  setup () {
    const fssgEsri = inject('fssgEsri') as FssgEsri
    const { center, stopWatch, startWatch, watchStatus } = useCenter(fssgEsri)

    const centerStr = computed(() => {
      const pt = center.value
      return `x: ${pt.x}, y: ${pt.y}, lon: ${pt.longitude}, lat: ${pt.latitude}`
    })

    return {
      stopWatch,
      startWatch,
      watchStatus,
      centerStr,
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
