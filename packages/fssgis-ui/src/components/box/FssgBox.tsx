/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { computed, CSSProperties, defineComponent, PropType } from 'vue'
import FssgIcon from '@fssgis/icon'
import FssgGrid, { GridAreas } from '../grid/FssgGrid'
import { isNullOrUndefined } from '../../../../fssgis-utils/src'

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
          <span class="fssg-box--value" style={ props.valueStyle }>{ toValue(props.value) }</span>
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

export interface IStatistics {
  title: string
  value?: string | number
  unit?: string
  iconUrl?: string
  iconStyle?: CSSProperties
  titleStyle?: CSSProperties
  valueStyle?: CSSProperties
  unitStyle?: CSSProperties
  style?: CSSProperties
  onClick?: (e: MouseEvent) => void
}

export function statisticsProps () {
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
  }
}

export function statisticsStyleProps () {
  return {
    iconUrl: {
      type: String,
      default: '',
    },
    iconStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    titleStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    valueStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    unitStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
  }
}

export function toValue (value?: string | number | null, initValue = '---') : string | number {
  return isNullOrUndefined(value) || value === ''
    ? initValue
    : value as string
}
