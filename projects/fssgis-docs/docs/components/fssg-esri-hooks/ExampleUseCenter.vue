<template>
  <span>地图中心：{{ centerStr }}</span><br>
  <button @click="stopWatch">
    停止监听
  </button>
  <button @click="startWatch">
    开始监听
  </button>
  <button @click="set">
    set
  </button>
  <span>监听状态：{{ watchStatus ? '开' : '关' }}</span>
</template>

<script lang="ts">
import { useCenter } from '@fssgis/fssg-esri-hooks'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  components: {
  },
  setup () {
    const { center, stopWatch, startWatch, watchStatus } = useCenter()

    const centerStr = computed(() => {
      const pt = center.value as __esri.Point
      return `x: ${pt.x}, y: ${pt.y}, lon: ${pt.longitude}, lat: ${pt.latitude}`
    })

    function set () {
      center.value = [113, 23]
    }

    return {
      stopWatch,
      startWatch,
      watchStatus,
      centerStr,
      set,
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
