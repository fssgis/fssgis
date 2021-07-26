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
        [1]
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
    class="fssg-box fssg-box--v4"
    :options="gridContainerOptions"
    inline
  >
    <template #item1>
      <div class="icon-container">
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
.fssg-box--v4 {
  font-size: 20px;
  padding: 8px;
  text-align: center;
}
.icon-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
