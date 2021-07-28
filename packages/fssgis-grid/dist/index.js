import { defineComponent, ref, onMounted, nextTick, computed, reactive, createVNode, mergeProps, Fragment } from 'vue';
import { $extend, isNullOrUndefined } from '@fssgis/utils';
import FssgIcon from '@fssgis/icon';

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
    onMounted(async () => {
      await nextTick();
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

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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

export { FssgBoxV1, FssgBoxV2, FssgBoxV3, FssgBoxV4, FssgGrid, statisticsProps, statisticsStyleProps, toValue, useGridAreaItems };
