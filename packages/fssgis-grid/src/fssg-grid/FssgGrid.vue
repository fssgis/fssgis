<template>
  <div
    ref="fssgGrid"
    class="fssg-grid"
    :style="{
      ...gridStyle,
      display: inline ? 'inline-grid' : 'grid'
    }"
  >
    <slot
      v-for="(item, index) in gridAreaItems.areaItems"
      :key="index"
      :style="{ gridArea: item }"
      :name="item"
    />
  </div>
</template>

<script lang="ts">
import { $extend } from '@fssgis/utils'
import { computed, ComputedRef, CSSProperties, defineComponent, nextTick, onMounted, PropType, reactive, ref, toRefs } from 'vue'

export default defineComponent({
  props: {
    options: {
      type: Object as PropType<IGridContainerOptions>,
      default: () => null,
    },
    inline: Boolean
  },
  setup (props, { slots }) {
    const fssgGrid = ref()

    onMounted(async () => {
      await nextTick()
      const dom = fssgGrid.value as HTMLDivElement
      state.gridAreaItems.areaItems.forEach((className, index) => {
        const d = dom.children.item(index) as HTMLDivElement
        d && (d.style.gridArea = className)
      })
    })

    const options = computed<IGridContainerOptions>(() => {
      const _options = props.options
      return $extend(true, {
        gridAreas: [],
        templateRows: Array.from({ length: _options.gridAreas.length }, () => 'auto').join(' '),
        templateColumns: Array.from({ length: _options.gridAreas[0]?.length }, () => 'auto').join(' '),
        gap: '0 0',
        margin: '8px'
      }, _options)
    })

    const state = reactive({
      gridAreaItems: useGridAreaItems(options.value.gridAreas)
    })

    const gridStyle = computed<CSSProperties>(() => {
      return {
        gridTemplateAreas: state.gridAreaItems.gridTemplateArea,
        gridTemplateRows: options.value.templateRows,
        gridTemplateColumns: options.value.templateColumns,
        gap: options.value.gap,
        height: options.value.height,
        width: options.value.width,
        margin: options.value.margin,
      }
    })

    return {
      gridStyle,
      ...toRefs(state),
      fssgGrid,
    }
  },
})


export type GridAreas = number[][] // number is 0 or 1, and the row and columns count need to be same

/*
[
  [1, 2, 1],
  [1, 0, 1], => ' "item-0-0 item-0-1 item-0-2" "item-1-0 . item-1-2" "item-2-0 . item-2-2" '
  [1, 0, 1],
]
 */

export interface IGridTemplateArea {
  gridTemplateArea: string
  areaItems: string[]
}

export function useGridAreaItems (gridAreas: GridAreas) : ComputedRef<IGridTemplateArea> {

  return computed(() => {
    const [gridTemplateArea, areaItems] = _createGridTemplateAreas(gridAreas)
    return { gridTemplateArea, areaItems }
  })
}

function _createGridTemplateAreas (gridAreas: GridAreas) : [string, string[]] {
  const templateArea : string[] = []
  const areaItems : Set<string> = new Set()
  gridAreas.forEach(row => {
    const item : string[] = []
    row.forEach(col => {
      if (col) {
        const className = `item${col}`
        item.push(className)
        areaItems.add(className)
      } else {
        item.push('.')
      }
    })
    templateArea.push(`"${item.join(' ')}"`)
  })

  return [templateArea.join(' '), [...areaItems]]
}

export interface IGridContainerOptions {
  gridAreas: number[][]
  templateRows?: string
  templateColumns?: string
  gap?: string
  width?: string
  height?: string
  margin?: string
}
</script>

<style lang="scss">
.fssg-grid {
  width: fit-content;
  height: fit-content;
}
</style>
