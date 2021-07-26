<script lang="ts">
import { defineComponent, PropType } from 'vue'
import FssgIcon from '@fssgis/icon'
import FssgGrid from '../../fssg-grid'
import { IStatistics, statisticsProps, statisticsStyleProps, toValue } from '..'
import FssgBoxV4 from '../fssg-box-v4'

export default defineComponent({
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
  setup () {

    const gridContainerOptions = {
      gridAreas: [
        [1],
        [2]
      ],
    }

    return {
      gridContainerOptions,
      toValue,
    }
  },
})
</script>

<template>
  <FssgGrid
    class="fssg-box fssg-box--v1"
    :options="gridContainerOptions"
    inline
  >
    <template #item1>
      <div class="top-content">
        <FssgIcon
          v-if="iconUrl"
          :url="iconUrl"
          :style="iconStyle"
        />

        <span
          class="title"
          :style="titleStyle"
        >{{ title }}</span>
      </div>
    </template>
    <template #item2>
      <div
        v-if="values"
        class="bottom-content small"
      >
        <FssgBoxV4
          v-for="(item, index) in values"
          :key="index"
          :="item"
        />
      </div>
      <div
        v-else
        class="bottom-content"
      >
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
  </FssgGrid>
</template>

<style lang="scss" scoped>
.top-content,
.bottom-content {
  text-align: center;
}
.value {
  margin-right: 4px;
  text-align: right;
}
</style>
