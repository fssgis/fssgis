import { $extend } from '@fssgis/utils';
import { defineComponent, computed, reactive, toRefs, openBlock, createBlock, Fragment, renderList, renderSlot } from 'vue';

var script = defineComponent({
    props: {
        options: {
            type: Object,
            default: () => null,
        },
    },
    setup(props) {
        const options = computed(() => {
            const _options = props.options;
            return $extend(true, {
                gridAreas: [],
                templateRows: Array.from({ length: _options.gridAreas.length }, () => '1fr').join(' '),
                templateColumns: Array.from({ length: _options.gridAreas[0]?.length }, () => '1fr').join(' '),
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
            };
        });
        return {
            gridStyle,
            ...toRefs(state),
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

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", {
    class: "fssg-grid",
    style: _ctx.gridStyle
  }, [
    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.gridAreaItems.areaItems, (item, index) => {
      return (openBlock(), createBlock("div", {
        key: index,
        class: item,
        style: { gridArea: item }
      }, [
        renderSlot(_ctx.$slots, item)
      ], 6 /* CLASS, STYLE */))
    }), 128 /* KEYED_FRAGMENT */))
  ], 4 /* STYLE */))
}

script.render = render;
script.__file = "packages/fssgis-grid/src/FssgGrid.vue";

export default script;
export { useGridAreaItems };
