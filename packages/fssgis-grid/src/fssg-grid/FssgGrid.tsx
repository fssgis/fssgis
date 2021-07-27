import { computed, ComputedRef, CSSProperties, defineComponent, nextTick, onMounted, PropType, reactive, ref } from 'vue'
import { $extend } from '@fssgis/utils'

import './fssg-grid.scss'

export type GridAreas = number[][]

export interface IGridTemplateArea {
  gridTemplateArea: string
  areaItems: string[]
}

export interface IFssgGridOptions {
  gridAreas: GridAreas
  templateRows?: string
  templateColumns?: string
  gap?: string
  width?: string
  height?: string
}

export const FssgGrid = defineComponent({
  props: {
    options: {
      type: Object as PropType<IFssgGridOptions>,
      default: () => ({})
    },
    inline: Boolean,
    margin: {
      type: String,
      default: () => ''
    }
  },
  setup (props, { slots }) {
    const fssgGrid = ref<InstanceType<typeof HTMLDivElement>>()

    onMounted(async () => {
      await nextTick()
      const dom = fssgGrid.value as HTMLDivElement
      state.gridAreaItems.areaItems.forEach((className, index) => {
        const d = dom.children.item(index) as HTMLDivElement
        if (!d) {
          return
        }
        d.style.gridArea = className
        if (props.margin) {
          d.style.margin = props.margin
        }
      })
    })

    const options = computed<IFssgGridOptions>(() => {
      const _options = props.options
      return $extend(true, {
        gridAreas: [],
        templateRows: Array.from({ length: _options.gridAreas.length }, () => 'auto').join(' '),
        templateColumns: Array.from({ length: _options.gridAreas[0]?.length }, () => 'auto').join(' '),
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
        height: options.value.height,
        width: options.value.width,
      }
    })

    return () =>
    <div
      ref={ fssgGrid }
      class="fssg-grid"
      style={{
        ...gridStyle.value,
        display: props.inline ? 'inline-grid' : 'grid'
      }}
    >
      {
        state.gridAreaItems.areaItems.map((item, index) => slots[item]?.() ?? '')
      }
    </div>
  }
})
export default FssgGrid

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
