import { defineComponent } from 'vue'
import FssgGrid from '../../fssg-grid'
import { statisticsProps, statisticsStyleProps, toValue } from '..'
import FssgIcon from '@fssgis/icon'

export const FssgBoxV5 = defineComponent({
  components: {
    FssgIcon,
    FssgGrid,
  },
  props: {
    ...statisticsProps(),
    ...statisticsStyleProps(),
  },
  setup (props) {

    const gridOptions = {
      gridAreas: [
        [1],
        [2],
        [3],
      ],
    }

    return () =>
    <FssgGrid
      class="fssg-box fssg-box--v2"
      inline
      options={ gridOptions }
      v-slots={{
        item1: () => <div class="fssg-box-icon">
          { props.iconUrl ? <FssgIcon url={ props.iconUrl } style={ props.iconStyle } /> : '' }
        </div>,
        item2: () => <div>
          <span class="fssg-box--title" style={ props.titleStyle }>{ props.title }</span>
        </div>,
        item3: () => <div>
          <span class="fssg-box--value" style={ props.valueStyle }>{ toValue(props.value) }</span>
          <span class="fssg-box--unit" style={ props.unitStyle }>{ props.unit }</span>
        </div>,
      }}
    />
  }
})

export default FssgBoxV5
