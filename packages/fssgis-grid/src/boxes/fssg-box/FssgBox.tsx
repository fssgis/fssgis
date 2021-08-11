import { computed, defineComponent, PropType } from 'vue'
import FssgIcon from '@fssgis/icon'
import FssgGrid, { GridAreas } from '../../fssg-grid'
import { statisticsProps, statisticsStyleProps, toValue } from '..'

export type Grid = Array<Array<number | 'i' | 't' | 'v' | 'u'>>

export const FssgBox = defineComponent({
  components: {
    FssgIcon,
    FssgGrid,
  },
  props: {
    ...statisticsProps(),
    ...statisticsStyleProps(),
    grid: {
      type: Array as PropType<Grid>,
      default: () => [],
    },
  },
  setup (props, { slots }) {
    const fields = {
      'i': 9999,
      't': 9998,
      'v': 9997,
      'u': 9996,
    }

    const gridAreas = computed<GridAreas>(() => {
      const ret : GridAreas = []
      props.grid.forEach(rows => {
        const newRows : number[] = []
        rows.forEach(value => {
          newRows.push(fields[value] ?? value)
        })
        ret.push(newRows)
      })
      return ret
    })

    return () =>
    <FssgGrid
      class="fssg-box"
      inline
      options={{
        gridAreas: gridAreas.value
      }}
      v-slots={{
        item9999: () => <div class="fssg-box-icon">
          { props.iconUrl ? <FssgIcon url={ props.iconUrl } style={ props.iconStyle } /> : '' }
        </div>,
        item9998: () => <div class="fssg-box-title">
          <span class="fssg-box--title" style={ props.titleStyle }>{ props.title }</span>
        </div>,
        item9997: () => <div class="fssg-box-value">
          <span class="fssg-box--value" style={ props.valueStyle }>{ props.value }</span>
        </div>,
        item9996: () => <div class="fssg-box-unit">
          <span class="fssg-box--unit" style={ props.unitStyle }>{ props.unit }</span>
        </div>,
        ...slots,
      }}
    />
  }
})

export default FssgBox
