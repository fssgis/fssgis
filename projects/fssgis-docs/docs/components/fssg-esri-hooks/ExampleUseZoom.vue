<template>
  <span>缩放等级：{{ zoom }}</span><br>
  <button @click="stopWatch">
    停止监听
  </button>
  <button @click="startWatch">
    开始监听
  </button>
  <button @click="zoom++">
    +
  </button>
  <button @click="zoom--">
    -
  </button>
  <span>监听状态：{{ watchStatus ? '开' : '关' }}</span>
</template>

<script lang="ts">
import { useZoom } from '@fssgis/fssg-esri-hooks'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
  },
  setup () {
    const { zoom, stopWatch, startWatch, watchStatus } = useZoom()

    return {
      zoom,
      stopWatch,
      startWatch,
      watchStatus,
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
