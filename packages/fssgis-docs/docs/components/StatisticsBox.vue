<script lang="ts">
import { isNullOrUndefined } from '@fssgis/utils'
import { CSSProperties, defineComponent, PropType } from 'vue'
export interface IStatistics {
  name: string
  value?: string | number
  unit: string
}

export function statisticsProps () {
  return {
    name: {
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
      default: {}
    },
    nameStyle: {
      type: Object as PropType<CSSProperties>,
      default: {}
    },
    valueStyle: {
      type: Object as PropType<CSSProperties>,
      default: {}
    },
    unitStyle: {
      type: Object as PropType<CSSProperties>,
      default: {}
    },
  }
}

export function toValue (value?: string | number | null, initValue = '---') : string | number {
  return isNullOrUndefined(value) || value === ''
    ? initValue
    : value as string
}

import FssgIcon from '@fssgis/icon'
import GridContainer from '@fssgis/grid'

export default defineComponent({
  components: {
    FssgIcon,
    GridContainer,
  },
  props: {
    ...statisticsProps(),
    ...statisticsStyleProps(),
  },
  setup () {

    const gridContainerOptions = {
      gridAreas: [
        [1],
        [2]
      ],
      gap: '8px'
    }

    return {
      gridContainerOptions,
      toValue,
    }
  },
})
</script>

<template>
  <GridContainer
    class="statistics-box-v1"
    :options="gridContainerOptions"
  >
    <template #item1>
      <div class="top-content">
        <FssgIcon
          v-if="iconUrl"
          :url="iconUrl"
          :style="iconStyle"
          width="40px"
          height="40px"
        />

        <span
          class="name"
          :style="nameStyle"
        >{{ name }}</span>
      </div>
    </template>
    <template #item2>
      <div class="bottom-content">
        <span
          class="value"
          :style="valueStyle"
        > {{ toValue(value) }}</span>
        <span
          class="unit"
          :style="unitStyle"
        >{{ unit }}</span>
      </div>
    </template>
  </GridContainer>
</template>

<style lang="scss" scoped>
.statistics-box-v1 {
  font-size: 20px;
  background-color: rgb(1, 204, 255, 0.2);
  border: 1px solid #98FFF395;
  box-shadow: 0 0 2px #98FFF3;
  padding: 8px;
}
.top-content,
.bottom-content {
  text-align: center;
}
.value {
  margin-right: 4px;
  font-size: 24px;
  font-weight: bold;
  text-align: right;
}
</style>
