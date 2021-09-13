<template>
  <div>
    <button @click="show = !show">
      演示
    </button>
    <div v-if="show">
      <div
        :id="id"
        :style="style"
      />
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { createGuid } from '@fssgis/utils'
import { computed, defineComponent, provide, ref } from 'vue'

export default defineComponent({
  props: {
    height: {
      type: Number,
      default: 400,
    }
  },
  setup (props) {
    const id = `map-${createGuid()}`
    provide('id', id)

    const style = computed(() => ({
      height: `${props.height}px`,
    }))

    const show = ref(false)

    return {
      style, id, show
    }
  },
})
</script>

<style lang="scss" scoped>

</style>
