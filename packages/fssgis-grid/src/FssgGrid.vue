<template>
  <div
    class="fssg-grid"
    :style="gridStyle"
  >
    <div
      v-for="(item, index) in gridAreaItems.areaItems"
      :key="index"
      :class="item"
      :style="{ gridArea: item }"
    >
      <slot :name="item" />
    </div>
  </div>
</template>

<script lang="ts">
import { $extend } from '@fssgis/utils'
import { computed, ComputedRef, CSSProperties, defineComponent, PropType, reactive, toRefs } from 'vue'

export default defineComponent({
  props: {
    options: {
      type: Object as PropType<IGridContainerOptions>,
      default: () => null,
    },
  },
  setup (props) {
    const options = computed<IGridContainerOptions>(() => {
      const _options = props.options
      return $extend(true, {
        gridAreas: [],
        templateRows: Array.from({ length: _options.gridAreas.length }, () => '1fr').join(' '),
        templateColumns: Array.from({ length: _options.gridAreas[0]?.length }, () => '1fr').join(' '),
        gap: '0 0',
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
      }
    })

    return {
      gridStyle,
      ...toRefs(state),
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
}
</script>

<style lang="scss">
.fssg-grid {
  display: inline-grid;
  width: fit-content;
  height: fit-content;
}
</style>
