<template>
  <span>缩放等级：{{ zoom }}</span><br>
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
import { useCenterZoom } from '@fssgis/fssg-esri-hooks'
import { computed, defineComponent, toRefs } from 'vue'

export default defineComponent({
  components: {
  },
  setup () {
    const { state, stopWatch, startWatch, watchStatus } = useCenterZoom()

    const centerStr = computed(() => {
      const pt = state.center
      return `x: ${pt.x}, y: ${pt.y}, lon: ${pt.longitude}, lat: ${pt.latitude}`
    })

    return {
      stopWatch,
      startWatch,
      watchStatus,
      centerStr,
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
