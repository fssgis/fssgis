import { defineComponent, computed, createVNode, ref, onMounted, reactive, mergeProps, Fragment } from 'vue';
import { $extend } from '@fssgis/utils';

const FssgIcon$1 = defineComponent({
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

const FssgIconFont = defineComponent({
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

const FssgGrid = defineComponent({
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    inline: Boolean,
    margin: {
      type: String,
      default: () => ''
    }
  },

  setup(props, {
    slots
  }) {
    const fssgGrid = ref();
    onMounted(() => {
      const dom = fssgGrid.value;
      state.gridAreaItems.areaItems.forEach((className, index) => {
        const d = dom.children.item(index);

        if (!d) {
          return;
        }

        d.style.gridArea = className;

        if (props.margin) {
          d.style.margin = props.margin;
        }
      });
    });
    const options = computed(() => {
      const _options = props.options;
      return $extend(true, {
        gridAreas: [],
        templateRows: Array.from({
          length: _options.gridAreas.length
        }, () => 'auto').join(' '),
        templateColumns: Array.from({
          length: _options.gridAreas[0]?.length
        }, () => 'auto').join(' '),
        gap: '0 0'
      }, _options);
    });
    const state = reactive({
      gridAreaItems: useGridAreaItems(options.value.gridAreas)
    });
    const gridStyle = computed(() => {
      return {
        gridTemplateAreas: state.gridAreaItems.gridTemplateArea,
        gridTemplateRows: options.value.templateRows,
        gridTemplateColumns: options.value.templateColumns,
        gap: options.value.gap,
        height: options.value.height,
        width: options.value.width
      };
    });
    return () => createVNode("div", {
      "ref": fssgGrid,
      "class": "fssg-grid",
      "style": { ...gridStyle.value,
        display: props.inline ? 'inline-grid' : 'grid'
      }
    }, [state.gridAreaItems.areaItems.map((item, index) => slots[item]?.() ?? '')]);
  }

});
function useGridAreaItems(gridAreas) {
  return computed(() => {
    const [gridTemplateArea, areaItems] = _createGridTemplateAreas(gridAreas);

    return {
      gridTemplateArea,
      areaItems
    };
  });
}

function _createGridTemplateAreas(gridAreas) {
  const templateArea = [];
  const areaItems = new Set();
  gridAreas.forEach(row => {
    const item = [];
    row.forEach(col => {
      if (col) {
        const className = `item${col}`;
        item.push(className);
        areaItems.add(className);
      } else {
        item.push('.');
      }
    });
    templateArea.push(`"${item.join(' ')}"`);
  });
  return [templateArea.join(' '), [...areaItems]];
}

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
defineComponent({
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

/**
 * 深度复制（采用JSON解析方式）
 * @param obj 复制对象
 */
function isNullOrUndefined(obj) {
  return obj === null || obj === undefined;
}

const FssgBox = defineComponent({
  components: {
    FssgIcon,
    FssgGrid
  },
  props: { ...statisticsProps(),
    ...statisticsStyleProps(),
    grid: {
      type: Array,
      default: () => []
    }
  },

  setup(props, {
    slots
  }) {
    const fields = {
      'i': 9999,
      't': 9998,
      'v': 9997,
      'u': 9996
    };
    const gridAreas = computed(() => {
      const ret = [];
      props.grid.forEach(rows => {
        const newRows = [];
        rows.forEach(value => {
          newRows.push(fields[value] ?? value);
        });
        ret.push(newRows);
      });
      return ret;
    });
    return () => createVNode(FssgGrid, {
      "class": "fssg-box",
      "inline": true,
      "options": {
        gridAreas: gridAreas.value
      }
    }, {
      item9999: () => createVNode("div", {
        "class": "fssg-box-icon"
      }, [props.iconUrl ? createVNode(FssgIcon, {
        "url": props.iconUrl,
        "style": props.iconStyle
      }, null) : '']),
      item9998: () => createVNode("div", {
        "class": "fssg-box-title"
      }, [createVNode("span", {
        "class": "fssg-box--title",
        "style": props.titleStyle
      }, [props.title])]),
      item9997: () => createVNode("div", {
        "class": "fssg-box-value"
      }, [createVNode("span", {
        "class": "fssg-box--value",
        "style": props.valueStyle
      }, [toValue(props.value)])]),
      item9996: () => createVNode("div", {
        "class": "fssg-box-unit"
      }, [createVNode("span", {
        "class": "fssg-box--unit",
        "style": props.unitStyle
      }, [props.unit])]),
      ...slots
    });
  }

});
function statisticsProps() {
  return {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: null
    },
    unit: {
      type: String,
      default: ''
    }
  };
}
function statisticsStyleProps() {
  return {
    iconUrl: {
      type: String,
      default: ''
    },
    iconStyle: {
      type: Object,
      default: () => ({})
    },
    titleStyle: {
      type: Object,
      default: () => ({})
    },
    valueStyle: {
      type: Object,
      default: () => ({})
    },
    unitStyle: {
      type: Object,
      default: () => ({})
    }
  };
}
function toValue(value, initValue = '---') {
  return isNullOrUndefined(value) || value === '' ? initValue : value;
}

const FssgBoxV4 = defineComponent({
  components: {
    FssgIcon,
    FssgGrid
  },
  props: { ...statisticsProps(),
    ...statisticsStyleProps()
  },

  setup(props) {
    const gridOptions = {
      gridAreas: [[1]]
    };
    return () => createVNode(FssgGrid, {
      "class": "fssg-box fssg-box--v4",
      "inline": true,
      "options": gridOptions
    }, {
      item1: () => createVNode("div", {
        "class": "fssg-box-content"
      }, [props.iconUrl ? createVNode(FssgIcon, {
        "url": props.iconUrl,
        "style": props.iconStyle
      }, null) : '', createVNode("span", {
        "class": "fssg-box--title",
        "style": props.titleStyle
      }, [props.title]), createVNode("span", {
        "class": "fssg-box--value",
        "style": props.valueStyle
      }, [toValue(props.value)]), createVNode("span", {
        "class": "fssg-box--unit",
        "style": props.unitStyle
      }, [props.unit])])
    });
  }

});

const FssgBoxV1 = defineComponent({
  components: {
    FssgIcon,
    FssgGrid,
    FssgBoxV4
  },
  props: { ...statisticsProps(),
    ...statisticsStyleProps(),
    values: {
      type: Array,
      default: () => null
    }
  },

  setup(props, {
    slots
  }) {
    const gridOptions = {
      gridAreas: [[1, 2], [3, 3]]
    };
    return () => createVNode(FssgGrid, {
      "class": "fssg-box fssg-box--v1",
      "inline": true,
      "options": gridOptions
    }, {
      item1: () => createVNode("div", {
        "class": "fssg-box-icon"
      }, [props.iconUrl ? createVNode(FssgIcon, {
        "url": props.iconUrl,
        "style": props.iconStyle
      }, null) : '']),
      item2: () => createVNode("div", {
        "class": "fssg-box-title"
      }, [createVNode("span", {
        "class": "fssg-box--title",
        "style": props.titleStyle
      }, [props.title])]),
      item3: () => createVNode("div", null, [props.values ? props.values.map((item, index) => createVNode(FssgBoxV4, mergeProps({
        "key": index
      }, item), null)) : createVNode(Fragment, null, [createVNode("span", {
        "class": "fssg-box--value",
        "style": props.valueStyle
      }, [toValue(props.value)]), createVNode("span", {
        "class": "fssg-box--unit",
        "style": props.unitStyle
      }, [props.unit ?? ''])])])
    });
  }

});

const FssgBoxV2 = defineComponent({
  components: {
    FssgIcon,
    FssgGrid
  },
  props: { ...statisticsProps(),
    ...statisticsStyleProps()
  },

  setup(props) {
    const gridOptions = {
      gridAreas: [[1, 2], [1, 3]]
    };
    return () => createVNode(FssgGrid, {
      "class": "fssg-box fssg-box--v2",
      "inline": true,
      "options": gridOptions
    }, {
      item1: () => createVNode("div", {
        "class": "fssg-box-icon"
      }, [props.iconUrl ? createVNode(FssgIcon, {
        "url": props.iconUrl,
        "style": props.iconStyle
      }, null) : '']),
      item2: () => createVNode("div", null, [createVNode("span", {
        "class": "fssg-box--title",
        "style": props.titleStyle
      }, [props.title])]),
      item3: () => createVNode("div", null, [createVNode("span", {
        "class": "fssg-box--value",
        "style": props.valueStyle
      }, [toValue(props.value)]), createVNode("span", {
        "class": "fssg-box--unit",
        "style": props.unitStyle
      }, [props.unit])])
    });
  }

});

const FssgBoxV3 = defineComponent({
  components: {
    FssgIcon,
    FssgGrid
  },
  props: { ...statisticsProps(),
    ...statisticsStyleProps()
  },

  setup(props) {
    const gridOptions = {
      gridAreas: [[4, 1], [2, 2], [3, 3]]
    };
    return () => createVNode(FssgGrid, {
      "class": "fssg-box fssg-box--v3",
      "inline": true,
      "options": gridOptions
    }, {
      item1: () => createVNode("div", {
        "class": "fssg-box-title"
      }, [createVNode("span", {
        "class": "fssg-box--title",
        "style": props.titleStyle
      }, [props.title])]),
      item4: () => createVNode("div", null, [props.iconUrl ? createVNode(FssgIcon, {
        "url": props.iconUrl,
        "style": props.iconStyle
      }, null) : '']),
      item2: () => createVNode("div", null, [createVNode("span", {
        "class": "fssg-box--value",
        "style": props.valueStyle
      }, [toValue(props.value)])]),
      item3: () => createVNode("div", null, [createVNode("span", {
        "class": "fssg-box--unit",
        "style": props.unitStyle
      }, [props.unit])])
    });
  }

});

const FssgBoxV5 = defineComponent({
  components: {
    FssgIcon,
    FssgGrid
  },
  props: { ...statisticsProps(),
    ...statisticsStyleProps()
  },

  setup(props) {
    const gridOptions = {
      gridAreas: [[1], [2], [3]]
    };
    return () => createVNode(FssgGrid, {
      "class": "fssg-box fssg-box--v2",
      "inline": true,
      "options": gridOptions
    }, {
      item1: () => createVNode("div", {
        "class": "fssg-box-icon"
      }, [props.iconUrl ? createVNode(FssgIcon, {
        "url": props.iconUrl,
        "style": props.iconStyle
      }, null) : '']),
      item2: () => createVNode("div", null, [createVNode("span", {
        "class": "fssg-box--title",
        "style": props.titleStyle
      }, [props.title])]),
      item3: () => createVNode("div", null, [createVNode("span", {
        "class": "fssg-box--value",
        "style": props.valueStyle
      }, [toValue(props.value)]), createVNode("span", {
        "class": "fssg-box--unit",
        "style": props.unitStyle
      }, [props.unit])])
    });
  }

});

const FssgBoxV6 = defineComponent({
  components: {
    FssgIcon,
    FssgGrid
  },
  props: { ...statisticsProps(),
    ...statisticsStyleProps()
  },

  setup(props) {
    return () => createVNode(FssgGrid, {
      "class": "fssg-box fssg-box--v2",
      "inline": true,
      "options": {
        gridAreas: [[1], [2]]
      }
    }, {
      item1: () => createVNode("div", {
        "class": "fssg-box-icon",
        "style": {
          backgroundImage: `url('${props.iconUrl}')`,
          backgroundSize: '100% 100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...props.iconStyle
        }
      }, [createVNode("span", null, [createVNode("span", {
        "class": "fssg-box--value",
        "style": props.valueStyle
      }, [toValue(props.value)]), createVNode("span", {
        "class": "fssg-box--unit",
        "style": props.unitStyle
      }, [props.unit])])]),
      item2: () => createVNode("div", null, [createVNode("span", {
        "class": "fssg-box--title",
        "style": props.titleStyle
      }, [props.title])])
    });
  }

});

export { FssgBox, FssgBoxV1, FssgBoxV2, FssgBoxV3, FssgBoxV4, FssgBoxV5, FssgBoxV6, FssgGrid, FssgIcon$1 as FssgIcon, FssgIconFont, statisticsProps, statisticsStyleProps, toValue, useGridAreaItems };
