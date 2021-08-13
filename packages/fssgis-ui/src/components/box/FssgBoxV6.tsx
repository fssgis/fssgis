import { defineComponent } from 'vue'
import FssgGrid from '../grid/FssgGrid'
import { statisticsProps, statisticsStyleProps, toValue } from './FssgBox'
import FssgIcon from '@fssgis/icon'

export const FssgBoxV6 = defineComponent({
  components: {
    FssgIcon,
    FssgGrid,
  },
  props: {
    ...statisticsProps(),
    ...statisticsStyleProps(),
  },
  setup (props) {

    return () => <FssgGrid
      class="fssg-box fssg-box--v2"
      inline
      options={{
        gridAreas: [
          [1],
          [2]
        ]
      }}
      v-slots={{
        item1: () => <div class="fssg-box-icon"
          style={{
            backgroundImage: `url('${props.iconUrl}')`,
            backgroundSize: '100% 100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...props.iconStyle,
          }}
        >
          <span>
            <span class="fssg-box--value" style={ props.valueStyle }>{ toValue(props.value) }</span>
            <span class="fssg-box--unit" style={ props.unitStyle }>{ props.unit }</span>
          </span>
        </div>,
        item2: () => <div>
          <span class="fssg-box--title" style={ props.titleStyle }>{ props.title }</span>
        </div>,
      }}
    />
  }
})

export default FssgBoxV6
