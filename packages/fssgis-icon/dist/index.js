import { defineComponent, computed, createVNode } from 'vue';

var FssgIcon = defineComponent({
  props: {
    height: {
      type: [String, Number],
      default: '16px'
    },
    width: {
      type: [String, Number],
      default: '16px'
    },
    url: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const iconUrl = computed(() => `url(${props.url})`);
    const widthStyle = computed(() => !isNaN(props.width) ? `${props.width}px` : props.width);
    const heightStyle = computed(() => !isNaN(props.height) ? `${props.height}px` : props.height);
    const style = computed(() => ({
      display: 'inline-block',
      backgroundSize: '100% 100%',
      width: widthStyle.value,
      height: heightStyle.value,
      backgroundImage: iconUrl.value
    }));
    return () => createVNode("div", {
      "class": "fssg-icon",
      "style": style.value
    }, null);
  }

});

export default FssgIcon;
