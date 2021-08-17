<template>
  <div>
    <textarea
      cols="60"
      rows="20"
      :value="gridAreasText"
      @input="e => gridAreasText = e.target.value"
    />

    <FssgGrid
      :key="key"
      class="fssg-grid"
      :options="options"
    >
      <template
        v-for="i in itemNumbers"
        :key="i"
        #[`item${i}`]
      >
        <div
          class="grid-area"
          :style="{ backgroundColor: createRandomColor() }"
        >
          {{ i }}
        </div>
      </template>
    </FssgGrid>
    <code>{{ JSON.stringify(options) }}</code>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue'
import { FssgGrid, IFssgGridOptions } from '@fssgis/ui'
import { createIntRandom, createGuid } from '@fssgis/utils'
import '@fssgis/ui/dist/index.css'

interface IState {
  gridAreasText: string
  options: IFssgGridOptions
  itemNumbers: number[]
}

export default defineComponent({
  components: {
    FssgGrid
  },
  setup () {

    function createRandomColor () : string {
      const r = createIntRandom(0, 255)
      const g = createIntRandom(0, 255)
      const b = createIntRandom(0, 255)
      return `rgb(${r}, ${g}, ${b})`
    }

    const state : IState = reactive({
      gridAreasText: `[
  [1, 2, 3, 4, 5],
  [7, 7, 3, 4, 5],
  [6, 8, 8, 9, 5]
]`,
      options: computed<IFssgGridOptions>(() => {
        return {
          gridAreas: JSON.parse(state.gridAreasText)
        }
      }),
      itemNumbers: computed<number[]>(() => {
        const ret = new Set<number>()
        for (let i = 0; i < state.options.gridAreas.length; i++) {
          const element = state.options.gridAreas[i]
          for (let j = 0; j < element.length; j++) {
            ret.add(element[j])
          }
        }
        return Array.from(ret)
      }),
    })

    const key = ref(createGuid())
    watch(state, () => key.value = createGuid(), { deep: true })

    return {
      createRandomColor,
      ...toRefs(state),
      key,
    }
  },
})
</script>

<style lang="scss" scoped>
.grid-area {
  color: white;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fssg-grid {
  border: 1px solid black;
}
</style>
