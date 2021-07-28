import { defineComponent, PropType } from 'vue'
import FssgGrid from '../../fssg-grid'
import { IStatistics, statisticsProps, statisticsStyleProps, toValue } from '..'
import FssgIcon from '@fssgis/icon'
import FssgBoxV4 from '../fssg-box-v4'

export const FssgBoxV1 = defineComponent({
  components: {
    FssgIcon,
    FssgGrid,
    FssgBoxV4,
  },
  props: {
    ...statisticsProps(),
    ...statisticsStyleProps(),
    values: {
      type: Array as PropType<IStatistics[]>,
      default: () => null
    },
  },
  setup (props, { slots }) {

    const gridOptions = {
      gridAreas: [
        [1, 2],
        [3, 3]
      ],
    }

    return () => <>
      { slots.before?.() ?? '' }
      <FssgGrid
        class="fssg-box fssg-box--v1"
        inline
        options={ gridOptions }
        v-slots={{
          item1: () => <div class="fssg-box-icon">
            { props.iconUrl ? <FssgIcon url={ props.iconUrl } style={ props.iconStyle } /> : '' }
          </div>,
          item2: () => <div class="fssg-box-title">
            <span class="fssg-box--title" style={ props.titleStyle }>{ props.title }</span>
          </div>,
          item3: () => <div>
            {
              props.values
                ? props.values.map((item, index) => <FssgBoxV4 key={ index } { ...item } />)
                : <>
                    <span class="fssg-box--value" style={ props.valueStyle }>{ toValue(props.value) }</span>
                    <span class="fssg-box--unit" style={ props.unitStyle }>{ props.unit ?? '' }</span>
                  </>
            }
          </div>,
        }}
      />
      { slots.after?.() ?? '' }
    </>
  }
})

export default FssgBoxV1
