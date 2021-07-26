<script lang="ts">
import { defineComponent } from 'vue'

import FssgIcon from '@fssgis/icon'
import FssgGrid from '../../FssgGrid.vue'
import { statisticsProps, statisticsStyleProps, toValue } from '..'

export default defineComponent({
  components: {
    FssgIcon,
    FssgGrid,
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
    class="fssg-box fssg-box--v2"
    :options="gridContainerOptions"
    inline
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
        <br v-if="iconUrl">
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
  </FssgGrid>
</template>

<style lang="scss" scoped>
.fssg-box--v2 {
  font-size: 20px;
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
