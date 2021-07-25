<template>
  <div class="fssg-icon" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    height: {
      type: [String, Number],
      default: '16px',
    },
    width: {
      type: [String, Number],
      default: '16px',
    },
    url: {
      type: String,
      default: '',
    },
  },
  setup (props) {


    const iconUrl = computed(() => `url(${props.url})`)
    const widthStyle = computed(() => !isNaN(props.width as number) ? `${props.width}px` : props.width)
    const heightStyle = computed(() => !isNaN(props.height as number) ? `${props.height}px` : props.height)

    return {
      iconUrl,
      widthStyle,
      heightStyle,
    }
  }
})

</script>

<style lang="scss">
.fssg-icon {
  display: inline-block;
  width: v-bind(widthStyle);
  height: v-bind(heightStyle);
  background-image: v-bind(iconUrl);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
