import { $extend, isNullOrUndefined } from '@fssgis/utils';
import { defineComponent, ref, onMounted, nextTick, computed, reactive, toRefs, openBlock, createBlock, Fragment, renderList, renderSlot, pushScopeId, popScopeId, resolveComponent, createVNode, createCommentVNode, toDisplayString, withScopeId, mergeProps } from 'vue';
import FssgIcon from '@fssgis/icon';

var script$4 = defineComponent({
    props: {
        options: {
            type: Object,
            default: () => null,
        },
        inline: Boolean,
        margin: {
            type: String,
            default: () => '',
        },
    },
    setup(props) {
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
                templateRows: Array.from({ length: _options.gridAreas.length }, () => 'auto').join(' '),
                templateColumns: Array.from({ length: _options.gridAreas[0]?.length }, () => 'auto').join(' '),
                gap: '0 0',
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
                width: options.value.width,
            };
        });
        return {
            gridStyle,
            ...toRefs(state),
            fssgGrid,
        };
    },
});
function useGridAreaItems(gridAreas) {
    return computed(() => {
        const [gridTemplateArea, areaItems] = _createGridTemplateAreas(gridAreas);
        return { gridTemplateArea, areaItems };
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
            }
            else {
                item.push('.');
            }
        });
        templateArea.push(`"${item.join(' ')}"`);
    });
    return [templateArea.join(' '), [...areaItems]];
}

function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", {
    ref: "fssgGrid",
    class: "fssg-grid",
    style: {
      ..._ctx.gridStyle,
      display: _ctx.inline ? 'inline-grid' : 'grid'
    }
  }, [
    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.gridAreaItems.areaItems, (item, index) => {
      return renderSlot(_ctx.$slots, item, {
        key: index,
        style: { gridArea: item }
      })
    }), 128 /* KEYED_FRAGMENT */))
  ], 4 /* STYLE */))
}

script$4.render = render$4;
script$4.__file = "packages/fssgis-grid/src/fssg-grid/FssgGrid.vue";

var script$3 = defineComponent({
    components: {
        FssgIcon,
        FssgGrid: script$4,
    },
    props: {
        ...statisticsProps(),
        ...statisticsStyleProps(),
    },
    setup() {
        const gridContainerOptions = {
            gridAreas: [
                [1]
            ],
        };
        return {
            gridContainerOptions,
            toValue,
        };
    },
});

const _withId$3 = /*#__PURE__*/withScopeId("data-v-0298e12e");

pushScopeId("data-v-0298e12e");
const _hoisted_1$3 = { class: "icon-container" };
popScopeId();

const render$3 = /*#__PURE__*/_withId$3((_ctx, _cache, $props, $setup, $data, $options) => {
  const _component_FssgIcon = resolveComponent("FssgIcon");
  const _component_FssgGrid = resolveComponent("FssgGrid");

  return (openBlock(), createBlock(_component_FssgGrid, {
    class: "fssg-box fssg-box--v4",
    options: _ctx.gridContainerOptions,
    inline: ""
  }, {
    item1: _withId$3(() => [
      createVNode("div", _hoisted_1$3, [
        (_ctx.iconUrl)
          ? (openBlock(), createBlock(_component_FssgIcon, {
              key: 0,
              url: _ctx.iconUrl,
              style: _ctx.iconStyle
            }, null, 8 /* PROPS */, ["url", "style"]))
          : createCommentVNode("v-if", true),
        createVNode("span", {
          class: "title",
          style: _ctx.titleStyle
        }, toDisplayString(_ctx.title), 5 /* TEXT, STYLE */),
        createVNode("span", {
          class: "value",
          style: _ctx.valueStyle
        }, toDisplayString(_ctx.toValue(_ctx.value)), 5 /* TEXT, STYLE */),
        createVNode("span", {
          class: "unit",
          style: _ctx.unitStyle
        }, toDisplayString(_ctx.unit), 5 /* TEXT, STYLE */)
      ])
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["options"]))
});

script$3.render = render$3;
script$3.__scopeId = "data-v-0298e12e";
script$3.__file = "packages/fssgis-grid/src/boxes/fssg-box-v4/FssgBoxV4.vue";

var script$2 = defineComponent({
    components: {
        FssgIcon,
        FssgGrid: script$4,
        FssgBoxV4: script$3,
    },
    props: {
        ...statisticsProps(),
        ...statisticsStyleProps(),
        values: {
            type: Array,
            default: () => null
        },
    },
    setup() {
        const gridContainerOptions = {
            gridAreas: [
                [1],
                [2]
            ],
        };
        return {
            gridContainerOptions,
            toValue,
        };
    },
});

const _withId$2 = /*#__PURE__*/withScopeId("data-v-1e11ebba");

pushScopeId("data-v-1e11ebba");
const _hoisted_1$2 = { class: "top-content" };
const _hoisted_2$2 = {
  key: 0,
  class: "bottom-content small"
};
const _hoisted_3$2 = {
  key: 1,
  class: "bottom-content"
};
popScopeId();

const render$2 = /*#__PURE__*/_withId$2((_ctx, _cache, $props, $setup, $data, $options) => {
  const _component_FssgIcon = resolveComponent("FssgIcon");
  const _component_FssgBoxV4 = resolveComponent("FssgBoxV4");
  const _component_FssgGrid = resolveComponent("FssgGrid");

  return (openBlock(), createBlock(_component_FssgGrid, {
    class: "fssg-box fssg-box--v1",
    options: _ctx.gridContainerOptions,
    inline: ""
  }, {
    item1: _withId$2(() => [
      createVNode("div", _hoisted_1$2, [
        (_ctx.iconUrl)
          ? (openBlock(), createBlock(_component_FssgIcon, {
              key: 0,
              url: _ctx.iconUrl,
              style: _ctx.iconStyle
            }, null, 8 /* PROPS */, ["url", "style"]))
          : createCommentVNode("v-if", true),
        createVNode("span", {
          class: "title",
          style: _ctx.titleStyle
        }, toDisplayString(_ctx.title), 5 /* TEXT, STYLE */)
      ])
    ]),
    item2: _withId$2(() => [
      (_ctx.values)
        ? (openBlock(), createBlock("div", _hoisted_2$2, [
            (openBlock(true), createBlock(Fragment, null, renderList(_ctx.values, (item, index) => {
              return (openBlock(), createBlock(_component_FssgBoxV4, mergeProps({ key: index }, item), null, 16 /* FULL_PROPS */))
            }), 128 /* KEYED_FRAGMENT */))
          ]))
        : (openBlock(), createBlock("div", _hoisted_3$2, [
            createVNode("span", {
              class: "value",
              style: _ctx.valueStyle
            }, toDisplayString(_ctx.toValue(_ctx.value)), 5 /* TEXT, STYLE */),
            createVNode("span", {
              class: "unit",
              style: _ctx.unitStyle
            }, toDisplayString(_ctx.unit), 5 /* TEXT, STYLE */)
          ]))
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["options"]))
});

script$2.render = render$2;
script$2.__scopeId = "data-v-1e11ebba";
script$2.__file = "packages/fssgis-grid/src/boxes/fssg-box-v1/FssgBoxV1.vue";

var script$1 = defineComponent({
    components: {
        FssgGrid: script$4,
        FssgIcon,
    },
    props: {
        ...statisticsProps(),
        ...statisticsStyleProps(),
    },
    setup() {
        const gridContainerOptions = {
            gridAreas: [
                [1],
                [2]
            ],
        };
        return {
            gridContainerOptions,
            toValue,
        };
    },
});

const _withId$1 = /*#__PURE__*/withScopeId("data-v-4ae08be5");

pushScopeId("data-v-4ae08be5");
const _hoisted_1$1 = { class: "top-content" };
const _hoisted_2$1 = { key: 1 };
const _hoisted_3$1 = { class: "bottom-content" };
popScopeId();

const render$1 = /*#__PURE__*/_withId$1((_ctx, _cache, $props, $setup, $data, $options) => {
  const _component_FssgIcon = resolveComponent("FssgIcon");
  const _component_FssgGrid = resolveComponent("FssgGrid");

  return (openBlock(), createBlock(_component_FssgGrid, {
    class: "fssg-box fssg-box--v2",
    options: _ctx.gridContainerOptions,
    inline: ""
  }, {
    item1: _withId$1(() => [
      createVNode("div", _hoisted_1$1, [
        (_ctx.iconUrl)
          ? (openBlock(), createBlock(_component_FssgIcon, {
              key: 0,
              url: _ctx.iconUrl,
              style: _ctx.iconStyle
            }, null, 8 /* PROPS */, ["url", "style"]))
          : createCommentVNode("v-if", true),
        (_ctx.iconUrl)
          ? (openBlock(), createBlock("br", _hoisted_2$1))
          : createCommentVNode("v-if", true),
        createVNode("span", {
          class: "title",
          style: _ctx.titleStyle
        }, toDisplayString(_ctx.title), 5 /* TEXT, STYLE */)
      ])
    ]),
    item2: _withId$1(() => [
      createVNode("div", _hoisted_3$1, [
        createVNode("span", {
          class: "value",
          style: _ctx.valueStyle
        }, toDisplayString(_ctx.toValue(_ctx.value)), 5 /* TEXT, STYLE */),
        createVNode("span", {
          class: "unit",
          style: _ctx.unitStyle
        }, toDisplayString(_ctx.unit), 5 /* TEXT, STYLE */)
      ])
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["options"]))
});

script$1.render = render$1;
script$1.__scopeId = "data-v-4ae08be5";
script$1.__file = "packages/fssgis-grid/src/boxes/fssg-box-v2/FssgBoxV2.vue";

var script = defineComponent({
    components: {
        FssgIcon,
        FssgGrid: script$4,
    },
    props: {
        ...statisticsProps(),
        ...statisticsStyleProps(),
    },
    setup() {
        const gridContainerOptions = {
            gridAreas: [
                [1],
                [2]
            ],
        };
        return {
            gridContainerOptions,
            toValue,
        };
    },
});

const _withId = /*#__PURE__*/withScopeId("data-v-b66be4b2");

pushScopeId("data-v-b66be4b2");
const _hoisted_1 = { class: "top-content" };
const _hoisted_2 = { class: "bottom-content" };
const _hoisted_3 = /*#__PURE__*/createVNode("br", null, null, -1 /* HOISTED */);
popScopeId();

const render = /*#__PURE__*/_withId((_ctx, _cache, $props, $setup, $data, $options) => {
  const _component_FssgIcon = resolveComponent("FssgIcon");
  const _component_FssgGrid = resolveComponent("FssgGrid");

  return (openBlock(), createBlock(_component_FssgGrid, {
    class: "fssg-box fssg-box--v3",
    options: _ctx.gridContainerOptions,
    inline: ""
  }, {
    item1: _withId(() => [
      createVNode("div", _hoisted_1, [
        (_ctx.iconUrl)
          ? (openBlock(), createBlock(_component_FssgIcon, {
              key: 0,
              url: _ctx.iconUrl,
              style: _ctx.iconStyle
            }, null, 8 /* PROPS */, ["url", "style"]))
          : createCommentVNode("v-if", true),
        createVNode("span", {
          class: "title",
          style: _ctx.titleStyle
        }, toDisplayString(_ctx.title), 5 /* TEXT, STYLE */)
      ])
    ]),
    item2: _withId(() => [
      createVNode("div", _hoisted_2, [
        createVNode("span", {
          class: "value",
          style: _ctx.valueStyle
        }, toDisplayString(_ctx.toValue(_ctx.value)), 5 /* TEXT, STYLE */),
        _hoisted_3,
        createVNode("span", {
          class: "unit",
          style: _ctx.unitStyle
        }, toDisplayString(_ctx.unit), 5 /* TEXT, STYLE */)
      ])
    ]),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["options"]))
});

script.render = render;
script.__scopeId = "data-v-b66be4b2";
script.__file = "packages/fssgis-grid/src/boxes/fssg-box-v3/FssgBoxV3.vue";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function statisticsProps() {
    return {
        title: {
            type: String,
            default: '',
        },
        value: {
            type: [String, Number],
            default: null,
        },
        unit: {
            type: String,
            default: '',
        },
    };
}
function statisticsStyleProps() {
    return {
        iconUrl: {
            type: String,
            default: '',
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
        },
    };
}
function toValue(value, initValue = '---') {
    return isNullOrUndefined(value) || value === ''
        ? initValue
        : value;
}

export default script$4;
export { script$2 as FssgBoxV1, script$1 as FssgBoxV2, script as FssgBoxV3, script$3 as FssgBoxV4, statisticsProps, statisticsStyleProps, toValue };
