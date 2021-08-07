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

var FssgIconFont = defineComponent({
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      default: '16px'
    },
    color: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const classNames = computed(() => {
      return `iconfont fssg-icon-${props.name}`;
    });
    const style = computed(() => {
      const ret = {};
      const size = props.size;

      if (size) {
        ret.fontSize = isNaN(size) ? size : `${size}px`;
      }

      if (props.color) {
        ret.color = props.color;
      }

      return ret;
    });
    return () => createVNode("span", {
      "class": classNames.value,
      "style": style.value
    }, null);
  }

});

export default FssgIcon;
export { FssgIconFont };
