import { computed, CSSProperties, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: '16px',
    },
    color: {
      type: String,
      default: '',
    },
  },
  setup (props) {
    const classNames = computed(() => {
      return `iconfont fssg-icon-${props.name}`
    })
    const style = computed(() => {
      const ret : CSSProperties = {}
      const size = props.size
      if (size) {
        ret.fontSize = isNaN(size as number) ? size : `${size}px`
      }
      if (props.color) {
        ret.color = props.color
      }
      return ret
    })

    return () => <span class={ classNames.value } style={ style.value }></span>

  }
})
