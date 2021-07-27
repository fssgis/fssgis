import { computed, CSSProperties, defineComponent } from 'vue'

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

    const style = computed<CSSProperties>(() => ({
      display: 'inline-block',
      backgroundSize: '100% 100%',
      width: widthStyle.value,
      height: heightStyle.value,
      backgroundImage: iconUrl.value,
    }))

    return () => <div class="fssg-icon" style={ style.value } />
  }
})
