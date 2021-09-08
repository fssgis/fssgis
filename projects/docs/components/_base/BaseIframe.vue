<template>
  <iframe
    :src="src"
    frameborder="0"
    :style="style"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: 'calc(100vh - 180px)',
    },
    src: {
      type: String,
      default: '',
    }
  },
  setup (props) {
    const style = computed(() => (({
      width: props.width,
      height: props.height,
    })))

    return {
      style
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
